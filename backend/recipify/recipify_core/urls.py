from django.urls import path, include
from rest_framework.routers import DefaultRouter
from recipify_core import views

router = DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"recipes", views.RecipeViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
