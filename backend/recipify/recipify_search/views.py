from datetime import datetime
from enum import Enum
import logging
from elasticsearch_dsl import Search
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.request import Request
from sentence_transformers import SentenceTransformer
from recipify_search.errors import PaginationError
from recipify_search.index import index_name

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')


class SearchModes(Enum):
    """Search modes for RecipeSearchView."""
    KEYWORD = "keyword"
    KNN = "knn"
    HYBRID = "hybrid"


logger = logging.getLogger(__name__)


class RecipeSearchView(APIView):
    """Recipe search API view."""

    suggestions_name = "phrase_suggestions"
    permission_classes = [permissions.AllowAny]

    def get_query(self, query: str, search: Search) -> Search:
        """Adds a traditional fulltext search query to the search object."""
        return search.query(
            "match",
            title__trigram=query,
        )

    def get_knn_query(self, query: str, search: Search, request: Request) -> Search:
        """Adds a KNN query to the search object. Retrieves the top 100 results, allowing for pagination, unless the number of hits are set to a number equal or larger than 100."""
        query_vector = embedding_model.encode(query).tolist()
        k = int(request.query_params.get("k", 100))

        return search.knn(
            "title_embedding",
            k=k,
            query_vector=query_vector,
            # Same as the Elasticsearch default
            num_candidates=min(k * 1.5, 10_000),
        )

    def get(self, request: Request, format=None):
        """Handle GET requests."""

        # Create an Elasticsearch search object
        search = Search(index=index_name)

        # Extract query parameter and apply it to the search object
        query = request.query_params.get("query", None)
        mode = request.query_params.get("mode", "keyword")
        if (query is None):
            search = search.query("match_all")
        elif (mode == SearchModes.KNN.value):
            # Smart mode (kNN search)
            search = self.get_knn_query(query, search, request)
        elif (mode == SearchModes.HYBRID.value):
            # Combine kNN search with traditional keyword search (hybrid retrieval)
            logger.info("Hybrid (hybrid retrieval) is not yet supported.")
            return Response({
                "error": "Bad request.",
                "message": "Hybrid mode is not yet supported."
            }, status=400)
        else:
            # Default to keyword mode (traditional fulltext search)
            search = self.get_query(query, search)

        # Exclude title_embedding field from the search result
        search = search.source(excludes=["title_embedding"])

        # Apply pagination to the search object
        try:
            search = self.get_pagination(request, search)
        except PaginationError as e:
            return Response({"error": str(e)}, status=e.status_code)

        # Include total hits in the search result
        search = search.params(track_total_hits=True)

        # Include phrase suggestions in the search result
        if query:
            search = self.get_suggestions(query, search)

        search = self.build_published_range_filter(search, request)

        # Execute the search query
        result = search.execute()

        if not result.success():
            return Response(
                {"error": "An error occurred while processing your request."},
                status=500,
            )
        else:
            result = result.to_dict()

        return Response(self.build_response(result, request))

    def build_pagination_dictionary(self, request: Request, total: int) -> dict:
        """Build pagination dictionary to be included in the response."""

        page = int(request.query_params.get("page", 1))
        hits = int(request.query_params.get("hits", 10))

        if hits == 0:
            return {
                "current": None,
                "first": None,
                "last": None,
                "next": None,
                "previous": None,
                "pages": [],
            }

        max_num_pages = total // hits if total % hits == 0 else total // hits + 1

        def build_url(page: int) -> str:
            uri = f"{request.path}?page={page}"
            for key, value in request.query_params.items():
                if key != "page":
                    uri += f"&{key}={value}"
            return uri

        # Determine page range
        start_page = max(1, page - 2)  # No negative page numbers
        end_page = min(max_num_pages, page + 2)

        # Edge cases
        if page <= 3:
            # Show first 5 pages for early pages
            end_page = min(max_num_pages, 5)
        if page > max_num_pages - 3:
            start_page = max(1, max_num_pages - 4)  # Adjust for last few pages

        pages = [build_url(p) for p in range(start_page, end_page + 1)]

        return {
            "current": build_url(page),
            "first": build_url(1),
            "last": build_url(max_num_pages),
            "next": (build_url(page + 1) if page < total // 10 else None),
            "previous": build_url(page - 1) if page > 1 else None,
            "pages": pages,
        }

    def get_pagination(self, request: Request, search) -> Search:
        """
        Traditional pagination which lets users jump to a specific result page. \n
        This method adds pagination to the search object.
        """

        hits = int(request.query_params.get("hits", 10))
        page = int(request.query_params.get("page", 1))
        offset = (page - 1) * hits

        # Elasticsearch has max result window of 10000. If the user tries to access more than 10000 results, raise an error.
        if offset + hits > 10000:
            raise PaginationError(
                message=f"Pagination limit exceeded. You tried to access page {page} with {hits} hits per page."
            )

        # Limit the number of hits per page to 100
        if hits > 100:
            raise PaginationError(
                message=f"Pagination limit exceeded. You tried to access {hits} hits per page, but the maximum is 100."
            )

        if hits < 0:
            raise PaginationError(
                message=f"You tried to access {hits} hits per page, but the minimum is 0."
            )

        if page < 1:
            raise PaginationError(
                message=f"You tried to access page {page}, but the minimum is 1."
            )

        return search[offset: offset + hits]

    def get_suggestions(self, query: str, search) -> Search:
        """
        This method adds phrase suggestions to the search object.
        """

        return search.suggest(
            name=self.suggestions_name,
            text=query,
            phrase={
                "field": "title",
                "size": 3,
                "highlight": {
                    "pre_tag": "<em>",
                    "post_tag": "</em>",
                },
            },
        )

    def build_suggestions(self, result) -> list:
        """Build suggestions list to be included in the response."""

        if "suggest" not in result or self.suggestions_name not in result["suggest"]:
            return []

        return [
            {"text": hit["text"], "highlighted": hit["highlighted"]}
            for hit in result["suggest"][self.suggestions_name][0]["options"]
        ]

    def build_published_range_filter(self, search, request: Request) -> Search:
        """Build published date range filter for the search object."""

        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)

        # Validate date format
        def is_valid_date(date_str):
            try:
                datetime.strptime(date_str, "%Y-%m-%d")
                return True
            except (ValueError, TypeError):
                return False

        if start_date and is_valid_date(start_date):
            search = search.filter("range", published={"gte": start_date})

        if end_date and is_valid_date(end_date):
            search = search.filter("range", published={"lte": end_date})

        return search

    def build_response(self, result: dict[str, any], request: Request) -> dict:
        """Build response dictionary to be returned by the API."""

        total = result["hits"]["total"]["value"]

        return {
            "total": total,
            "hits": [
                {"id": hit["_id"], **hit["_source"]} for hit in result["hits"]["hits"]
            ],
            "pagination": self.build_pagination_dictionary(request, total),
            "suggestions": self.build_suggestions(result),
        }


class RecipeAutoCompleteView(APIView):
    """Recipe auto-complete API view."""

    permission_classes = [permissions.AllowAny]

    def get(self, request: Request, format=None):
        """Handle GET requests."""

        # Create an Elasticsearch search object
        search = Search(index=index_name)

        # Extract query parameter and apply it to the search object
        query = request.query_params.get("query", None)

        if not query:
            return Response({})

        search = search.suggest(
            name="title_suggestions",
            text=query,
            completion={
                "field": "title.completion",
                "fuzzy": {"fuzziness": "AUTO"},
            },
        ).source(["title"])

        # Execute the search query
        result = search.execute()

        if not result.success():
            return Response(
                {"error": "An error occurred while processing your request."},
                status=500,
            )
        else:
            result = result.to_dict()

        # Prepare the response data
        response = {
            "suggestions": [
                {"id": hit["_id"], "text": hit["text"]}
                for hit in result["suggest"]["title_suggestions"][0]["options"]
            ]
        }

        return Response(response)
