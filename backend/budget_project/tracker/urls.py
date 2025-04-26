from django.urls import path
from .views import EntryListCreateView, EntryDetailView

urlpatterns = [
    path('entries/', EntryListCreateView.as_view(), name='entry-list'),
    path('entries/<int:pk>/', EntryDetailView.as_view(), name='entry-detail'),
]