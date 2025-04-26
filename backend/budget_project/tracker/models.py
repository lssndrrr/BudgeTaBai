from django.db import models
from django.conf import settings

class Entry(models.Model):
    CATEGORY_CHOICES = (
        ('food', 'Food'),
        ('travel', 'Travel'),
        ('bills', 'Bills'),
        ('other', 'Other'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, null=True, blank=True)  # Predefined categories
    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"{self.title} - {self.amount}"

class Budget(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.username}'s Budget: {self.total_budget}"