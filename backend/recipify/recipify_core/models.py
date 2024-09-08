from django.db import models
from django.contrib.postgres.fields import ArrayField


class Recipe(models.Model):
    title = models.TextField(max_length=200)
    ingredients = ArrayField(models.TextField(max_length=400))
    instructions = models.TextField(max_length=1000)
    image_name = models.TextField(max_length=200)
    cleaned_ingredients = ArrayField(models.TextField(max_length=400))

    def __str__(self):
        return f"{self.id}: {self.title}"
