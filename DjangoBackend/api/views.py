from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Prefetch
from .models import DimEmployees, DimDepartments, DimTime, FactPayroll, FactAttendance, FactBonusAdjustments
from .serializers import DimEmployeesSerializer


@api_view(['GET'])
def employees_list(request, field=None):
    """
    Handles listing all employees with data joined from related tables.
    If a specific field is provided, only that field is returned.
    """
    try:
        # Include related tables dynamically
        employees = DimEmployees.objects.prefetch_related(
            Prefetch('factpayroll_set'),
            Prefetch('factattendance_set'),
            Prefetch('factbonusadjustments_set')
        )

        if field:
            # Check if the field exists in any of the related models
            fields = field.split("__")  # Handle related fields like "factpayroll__base_salary"
            valid_fields = set(DimEmployees._meta.get_fields()) | \
                           set(DimDepartments._meta.get_fields()) | \
                           set(DimTime._meta.get_fields()) | \
                           set(FactPayroll._meta.get_fields()) | \
                           set(FactAttendance._meta.get_fields()) | \
                           set(FactBonusAdjustments._meta.get_fields())
            if field in valid_fields:
                # Return only the requested field
                employees_data = employees.values(field)
                return Response(list(employees_data))
            else:
                return Response(
                    {"error": f"Field '{field}' does not exist in any related model."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # If no field is specified, return all joined data
        serializer = DimEmployeesSerializer(employees, many=True)
        return Response(serializer.data)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def employee_detail(request, pk):
    """
    Retrieve a specific employee with dynamically selected attributes.
    """
    try:
        employee = DimEmployees.objects.get(pk=pk)
    except DimEmployees.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    attributes = request.query_params.getlist('attributes')  # Get specified attributes

    if attributes:
        # Use values() to filter and include specific attributes
        query = DimEmployees.objects.filter(pk=pk).values(*attributes)

        # Handle related fields if included
        related_data = {}
        if any(attr.startswith('factpayroll__') for attr in attributes):
            payroll_data = FactPayroll.objects.filter(employee_key=employee).values(
                *[attr.split('factpayroll__')[1] for attr in attributes if attr.startswith('factpayroll__')]
            )
            related_data['factpayroll'] = list(payroll_data)

        query_data = query.first() if query else {}
        query_data.update(related_data)
        return Response(query_data)

    # Default: Return all data if no attributes are specified
    serializer = DimEmployeesSerializer(employee)
    return Response(serializer.data)
@api_view(['POST'])
def execute_sql(request):
    """
    Executes a raw SQL query provided in the request body and returns the result.
    """
    # Get SQL query from request body
    sql_query = request.data.get('query')
    if not sql_query:
        return Response({"error": "No SQL query provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Execute the SQL query
        with connection.cursor() as cursor:
            cursor.execute(sql_query)
            # If the query has results, fetch them
            if cursor.description:
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchall()
                results = [dict(zip(columns, row)) for row in rows]
                return Response(results, status=status.HTTP_200_OK)
            else:
                return Response({"message": "Query executed successfully. No data returned."}, status=status.HTTP_200_OK)
    except Exception as e:
        # Handle SQL errors
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)