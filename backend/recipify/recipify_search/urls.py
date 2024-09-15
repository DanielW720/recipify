from django.urls import path
from recipify_search import views

urlpatterns = [
    path("", views.RecipeSearchView.as_view()),
]
