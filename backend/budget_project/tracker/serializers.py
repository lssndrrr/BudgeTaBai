# filepath: tracker/serializers.py
from rest_framework import serializers
from .models import Entry

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id', 'title', 'amount', 'entry_type', 'date', 'category', 'notes']