from rest_framework import serializers
from .models import Entry, Budget

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ['id', 'title', 'amount', 'date', 'category'] 

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['total_budget']