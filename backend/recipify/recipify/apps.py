from django.contrib.admin.apps import AdminConfig


class RecipifyAdminConfig(AdminConfig):
    default_site = "recipify.admin.RecipifyAdminSite"
