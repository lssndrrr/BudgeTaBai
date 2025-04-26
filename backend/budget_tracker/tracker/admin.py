# admin.py
from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Category, Entry

# Register Category and Entry models
admin.site.register(Category)
admin.site.register(Entry)

# Customize User admin to display additional fields in the user list
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff']
    list_filter = ['is_active', 'is_staff']
    search_fields = ['username', 'email']
    ordering = ['username']

# Register the custom UserAdmin
admin.site.unregister(User)  # Unregister the default User model
admin.site.register(User, CustomUserAdmin)
