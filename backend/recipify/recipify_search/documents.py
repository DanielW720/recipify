from elasticsearch_dsl import Index, Keyword, Mapping, Text, tokenizer
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from recipify_core.models import Recipe

# Create an Elasticsearch index for the Recipe model
recipes = Index("recipes")

# Set the number of shards and replicas for the index
recipes.settings(number_of_shards=1, number_of_replicas=0)

# Define a custom analyzer for trigram tokenization
recipes.analyzer(
    "trigram_analyzer",
    type="custom",
    tokenizer=tokenizer("trigram", "ngram", min_gram=3, max_gram=3),
    filter=["lowercase"],
)

# Define the mapping for the Recipe document
recipes_mapping = Mapping()
recipes_mapping.field(
    "title",
    "text",
    fields={
        "raw": Keyword(),
        "trigram": Text(analyzer="trigram_analyzer"),
    },
)
recipes_mapping.field("image", "text", fields={"raw": Keyword()})
recipes_mapping.field("ingredients", "text")
recipes_mapping.field("instructions", "text")
recipes.mapping(recipes_mapping)


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
