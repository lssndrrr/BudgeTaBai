from django.db import models
from django.conf import settings

class Entry(models.Model):
    ENTRY_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )

    CATEGORY_CHOICES = (
        ('food', 'Food'),
        ('travel', 'Travel'),
        ('bills', 'Bills'),
        ('health', 'Health'),
        ('salary', 'Salary'),
        ('revenue', 'Revenue'),
        ('shopping', 'Shopping'),
        ('entertainment', 'Entertainment'),
        ('education', 'Education'),
        ('transportation', 'Transportation'),
        ('housing', 'Housing'),
        ('utilities', 'Utilities'),
        ('insurance', 'Insurance'),
        ('savings', 'Savings'),
        ('investments', 'Investments'),
        ('gifts', 'Gifts'),
        ('charity', 'Charity'),
        ('vacation', 'Vacation'),
        ('pets', 'Pets'),
        ('clothing', 'Clothing'),
        ('entertainment', 'Entertainment'),
        ('other', 'Other'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, null=True, blank=True)  # Predefined categories
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    entry_type = models.CharField(max_length=7, choices=ENTRY_TYPES)
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} - {self.amount}"