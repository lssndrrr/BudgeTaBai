from django.shortcuts import render, redirect, get_object_or_404
from .models import Entry, Category
from .forms import EntryForm, RegisterForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.db.models import Sum
from .serializers import EntrySerializer
from datetime import date
import csv
from django.http import HttpResponse

# Import the filtering and sorting classes
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters
from rest_framework import filters
from rest_framework.viewsets import ModelViewSet

# Views for normal user interaction (non-API)

@login_required
def dashboard(request):
    # Get the current month
    current_month = date.today().month
    current_year = date.today().year
    
    # Filter entries for the current month
    entries = Entry.objects.filter(user=request.user, date__month=current_month, date__year=current_year)
    
    income = sum(e.amount for e in entries if e.type == 'income')
    expenses = sum(e.amount for e in entries if e.type == 'expense')
    balance = income - expenses
    
    # Expenses by category
    category_expenses = entries.filter(type='expense').values('category__name').annotate(total=Sum('amount'))
    
    return render(request, 'tracker/dashboard.html', {
        'entries': entries,
        'income': income,
        'expenses': expenses,
        'balance': balance,
        'category_expenses': category_expenses
    })

@login_required
def add_entry(request):
    if request.method == 'POST':
        form = EntryForm(request.POST)
        if form.is_valid():
            entry = form.save(commit=False)
            entry.user = request.user
            entry.save()
            return redirect('dashboard')
    else:
        form = EntryForm()
    return render(request, 'tracker/form.html', {'form': form})

@login_required
def edit_entry(request, pk):
    entry = get_object_or_404(Entry, pk=pk, user=request.user)
    form = EntryForm(request.POST or None, instance=entry)
    if form.is_valid():
        form.save()
        return redirect('dashboard')
    return render(request, 'tracker/form.html', {'form': form})

@login_required
def delete_entry(request, pk):
    entry = get_object_or_404(Entry, pk=pk, user=request.user)
    if request.method == 'POST':
        entry.delete()
        return redirect('dashboard')
    return render(request, 'tracker/confirm_delete.html', {'entry': entry})

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = RegisterForm()
    return render(request, 'registration/register.html', {'form': form})

@login_required
def export_csv(request):
    entries = Entry.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="budget_entries.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Title', 'Amount', 'Date', 'Category', 'Type', 'Notes'])
    
    for entry in entries:
        writer.writerow([entry.title, entry.amount, entry.date, entry.category, entry.get_type_display(), entry.notes])
    
    return response

# New API-based views for sorting/filtering

class EntryFilter(django_filters.FilterSet):
    category = django_filters.NumberFilter(field_name='category__id', lookup_expr='exact')
    type = django_filters.ChoiceFilter(choices=Entry.TYPE_CHOICES)
    start_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    end_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')

    class Meta:
        model = Entry
        fields = ['category', 'type', 'start_date', 'end_date']

class EntryViewSet(ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = EntryFilter
    ordering_fields = ['date', 'amount', 'category__name']
    ordering = ['date']  # Default ordering by date

