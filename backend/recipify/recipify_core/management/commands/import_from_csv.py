import csv
import ast
from django.core.management.base import BaseCommand
from recipify_core.models import Recipe


class Command(BaseCommand):
    help = "Import recipes from a CSV file"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **kwargs):
        file_path = kwargs["file_path"]
        self.import_recipes(file_path)

    def import_recipes(self, file_path):
        with open(file_path, "r", encoding="utf-8") as file:

            reader = csv.DictReader(file)
            for row in reader:
                # Use ast.literal_eval to convert string representation of lists into actual lists
                ingredients = ast.literal_eval(row["Ingredients"])
                cleaned_ingredients = ast.literal_eval(row["Cleaned_Ingredients"])

                recipe = Recipe(
                    title=row["Title"],
                    ingredients=ingredients,
                    instructions=row["Instructions"],
                    image_name=row["Image_Name"],
                    cleaned_ingredients=cleaned_ingredients,
                )
                try:
                    recipe.save()
                    print(f"Saved {recipe}")
                except Exception as e:
                    print(f"Failed to save {recipe}: {e}")
