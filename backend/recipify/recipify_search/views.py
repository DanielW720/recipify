from elasticsearch_dsl import Search
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.request import Request
from recipify_search.errors import PaginationError
from recipify_search.index import index_name


class RecipeSearchView(APIView):
    """Recipe search API view."""

    permission_classes = [permissions.AllowAny]

    def get(self, request: Request, format=None):
        """Handle GET requests."""

        # Create an Elasticsearch search object
        search = Search(index=index_name)

        # Extract query parameter and apply it to the search object
        query = request.query_params.get("query", None)
        search = search.query(
            "match",
            title__trigram=query,
        )

        # Apply pagination to the search object
        try:
            search = self.get_pagination(request, search)
        except PaginationError as e:
            return Response({"error": str(e)}, status=e.status_code)

        # Execute the search query
        result = search.execute().to_dict()

        # Prepare the response data
        total = result["hits"]["total"]["value"]
        response = {
            "total": total,
            "hits": result["hits"]["hits"],
            "pagination": self.build_pagination_dictionary(request, total),
        }

        return Response(response)

    def build_pagination_dictionary(self, request: Request, total: int) -> dict:
        """Build pagination dictionary."""

        page = int(request.query_params.get("page", 1))
        hits = int(request.query_params.get("hits", 10))
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
            end_page = min(max_num_pages, 5)  # Show first 5 pages for early pages
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

    def get_pagination(self, request, search) -> Search:
        """Traditional pagination which lets users jump to a specific result page."""

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

        if hits < 1:
            raise PaginationError(
                message=f"You tried to access {hits} hits per page, but the minimum is 1."
            )

        if page < 1:
            raise PaginationError(
                message=f"You tried to access page {page}, but the minimum is 1."
            )

        return search[offset : offset + hits]
