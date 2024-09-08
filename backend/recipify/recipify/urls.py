from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("recipify_core.urls")),
    path("api-auth/", include("rest_framework.urls")),
]
