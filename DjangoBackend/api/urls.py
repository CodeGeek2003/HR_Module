from django.urls import path
from . import views

urlpatterns = [
    # General endpoints
    path('employees/', views.employees_list, name='employees-list'),  # List all employees or filter by attributes
    path('employees/<int:pk>/', views.employee_detail, name='employee-detail'),
    # Retrieve, update, or delete an employee by ID

    # Field-specific endpoints
    path('employees/<int:pk>/field/<str:field>/', views.employee_detail, name='employee-detail-field'),
    # Get a specific field for an employee
    path('employees/field/<str:field>/', views.employees_list, name='employees-list-field'),
    # Get a specific field for all employees

    # SQL query endpoint
    path('execute_sql/', views.execute_sql, name='execute-sql'),  # Execute raw SQL queries
]
