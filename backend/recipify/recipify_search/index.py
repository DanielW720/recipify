from elasticsearch_dsl import Index, Keyword, Mapping, Text, tokenizer, Completion

index_name = "recipes"

# Create an Elasticsearch index for the Recipe model
recipes = Index(index_name)

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
        "completion": Completion(),
    },
)
recipes_mapping.field("image", "text", fields={"raw": Keyword()})
recipes_mapping.field("ingredients", "text")
recipes_mapping.field("instructions", "text")
recipes_mapping.field("published", "date")
recipes.mapping(recipes_mapping)
