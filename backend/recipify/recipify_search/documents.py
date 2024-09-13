from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from recipify_core.models import Recipe


@registry.register_document
class RecipeDocument(Document):
    class Index:
        name = "recipes"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
        }

    class Django:
        model = Recipe
        fields = [
            "title",
            "image",
        ]
