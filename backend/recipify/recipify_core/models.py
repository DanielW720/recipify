import os
from django.db import models
from django.contrib.postgres.fields import ArrayField
from recipify import settings


class Recipe(models.Model):
    title = models.TextField(max_length=200)
    ingredients = ArrayField(models.TextField(max_length=400))
    instructions = models.TextField()
    image_name = models.TextField(max_length=200)
    image = models.ImageField(upload_to="images/", null=True)
    cleaned_ingredients = ArrayField(models.TextField(max_length=400))

    def __str__(self):
        return f"{self.id}: {self.title}"

    # Override delete method to remove the image file when a recipe is deleted
    def delete(self, *args, **kwargs):
        if self.image:
            image_path = os.path.join(settings.MEDIA_ROOT, self.image.name)
            if os.path.exists(image_path):
                os.remove(image_path)  # Delete the image file
        super().delete(*args, **kwargs)
