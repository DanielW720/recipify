import csv
import os
import ast
from django.core.files import File
from django.core.management.base import BaseCommand
from recipify_core.models import Recipe
import random
from datetime import timedelta, datetime


class Command(BaseCommand):
    help = "Import recipes from a CSV file. Expects a path to the directory where the data.csv file is located, together with the Food Images/Food Images/ directory. Do not include trailing slash in the path."

    def add_arguments(self, parser):
        parser.add_argument("path", type=str)

    def handle(self, *args, **kwargs):
        path = kwargs["path"]
        self.import_recipes(path)

    def random_date(self):
        """Function to generate a random date within the past year."""
        start_date = datetime.now() - timedelta(days=365)
        return start_date + timedelta(days=random.randint(0, 365))

    def import_recipes(self, path):
        csv_path = f"{path}/data.csv"
        with open(csv_path, "r", encoding="utf-8") as file:
            reader = csv.DictReader(file)
            for row in reader:
                # Use ast.literal_eval to convert string representation of lists into actual lists
                ingredients = ast.literal_eval(row["Ingredients"])
                cleaned_ingredients = ast.literal_eval(
                    row["Cleaned_Ingredients"])

                # Look for the image file in the Food Images/Food Images/ directory
                image_path = f"{path}/Food Images/Food Images/{row['Image_Name']}.jpg"
                image_file = None
                if os.path.exists(image_path):
                    image_file = File(open(image_path, "rb"))
                    image_file.name = f"{row['Image_Name']}.jpg"

                recipe = Recipe(
                    title=row["Title"],
                    ingredients=ingredients,
                    instructions=row["Instructions"],
                    image_name=f'{row["Image_Name"]}.jpg',
                    image=image_file,
                    cleaned_ingredients=cleaned_ingredients,
                    published=self.random_date(),
                )

                try:
                    recipe.save()
                    print(f"Saved {recipe}")
                except Exception as e:
                    print(f"Failed to save {recipe}: {e}")
