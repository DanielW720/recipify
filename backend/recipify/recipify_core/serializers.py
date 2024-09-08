from rest_framework import serializers

from recipify_core.models import Recipe
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "url",
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "groups",
            "user_permissions",
        ]


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Recipe
        fields = "__all__"
