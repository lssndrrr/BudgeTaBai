from rest_framework import serializers
from .models import Entry, Category, Budget, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # You can customize this as needed

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']  # Serialize the category ID and name

class EntrySerializer(serializers.ModelSerializer):
    category = CategorySerializer()  # Include category info in the entry serializer

    class Meta:
        model = Entry
        fields = ['id', 'user', 'title', 'amount', 'date', 'type', 'category', 'notes']

class BudgetSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested User Serializer
    category = CategorySerializer()  # Nested Category Serializer

    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'amount']  # Serialize the budget ID, user, category, and amount