from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# Router for the API views
router = DefaultRouter()
router.register(r'entries', views.EntryViewSet, basename='entry')

urlpatterns = [
    # Regular views for user interaction
    path('', views.dashboard, name='dashboard'),
    path('add/', views.add_entry, name='add_entry'),
    path('edit/<int:pk>/', views.edit_entry, name='edit_entry'),
    path('delete/<int:pk>/', views.delete_entry, name='delete_entry'),
    path('register/', views.register, name='register'),
    path('export_csv/', views.export_csv, name='export_csv'),
    
    # Include the router URLs for API views
    path('api/', include(router.urls)),
]
