from rest_framework import serializers
from .models import DimEmployees, DimDepartments, DimTime, FactPayroll, FactAttendance, FactBonusAdjustments, Timesheet


class DimDepartmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DimDepartments
        fields = '__all__'


class DimTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DimTime
        fields = '__all__'


class FactPayrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactPayroll
        fields = '__all__'


class FactAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactAttendance
        fields = '__all__'


class FactBonusAdjustmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FactBonusAdjustments
        fields = '__all__'


class TimesheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timesheet
        fields = '__all__'


class DimEmployeesSerializer(serializers.ModelSerializer):
    factpayroll = FactPayrollSerializer(many=True, source='factpayroll_set', read_only=True)
    factattendance = FactAttendanceSerializer(many=True, source='factattendance_set', read_only=True)
    factbonusadjustments = FactBonusAdjustmentsSerializer(many=True, source='factbonusadjustments_set', read_only=True)
    timesheet = TimesheetSerializer(many=True, source='timesheet_set', read_only=True)
    department_key = DimDepartmentsSerializer(read_only=True)

    class Meta:
        model = DimEmployees
        fields = '__all__'
