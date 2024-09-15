from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from recipify_core.models import Recipe
from recipify_search.index import recipes


@registry.register_document
@recipes.document
class RecipeDocument(Document):
    """Recipe Elasticsearch document."""

    # ArrayField is not supported by Django Elasticsearch DSL
    # We need to convert the ingredients to a list of strings
    ingredients = fields.TextField(attr="ingredients_to_list")

    class Django:
        model = Recipe
        fields = [
            "title",
            "instructions",
            "image",
        ]
