from django.urls import include, path
from django.conf.urls.static import static

from recipify import settings
from recipify.admin import admin

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("recipify_core.urls")),
    path("api-auth/", include("rest_framework.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
