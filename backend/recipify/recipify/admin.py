from django.contrib import admin


class RecipifyAdminSite(admin.AdminSite):
    site_header = "Recipify Administration"
    site_title = "Recipify Admin"
    index_title = "Recipify Administration"
