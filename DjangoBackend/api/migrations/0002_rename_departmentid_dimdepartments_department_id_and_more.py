# Generated by Django 5.1.5 on 2025-01-25 06:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='dimdepartments',
            old_name='DepartmentID',
            new_name='department_id',
        ),
        migrations.RenameField(
            model_name='dimdepartments',
            old_name='DepartmentName',
            new_name='department_name',
        ),
        migrations.RenameField(
            model_name='dimdepartments',
            old_name='ManagerID',
            new_name='manager_id',
        ),
        migrations.RenameField(
            model_name='dimemployees',
            old_name='Country',
            new_name='country',
        ),
        migrations.RenameField(
            model_name='dimemployees',
            old_name='EmployeeID',
            new_name='employee_id',
        ),
        migrations.RenameField(
            model_name='dimemployees',
            old_name='FullName',
            new_name='full_name',
        ),
        migrations.RenameField(
            model_name='dimemployees',
            old_name='Gender',
            new_name='gender',
        ),
        migrations.RenameField(
            model_name='dimemployees',
            old_name='HireDate',
            new_name='hire_date',
        ),
        migrations.RenameField(
            model_name='dimemployees',
            old_name='Role',
            new_name='role',
        ),
        migrations.RenameField(
            model_name='dimtime',
            old_name='Date',
            new_name='date',
        ),
        migrations.RenameField(
            model_name='dimtime',
            old_name='Day',
            new_name='day',
        ),
        migrations.RenameField(
            model_name='dimtime',
            old_name='DayOfWeek',
            new_name='day_of_week',
        ),
        migrations.RenameField(
            model_name='dimtime',
            old_name='Month',
            new_name='month',
        ),
        migrations.RenameField(
            model_name='dimtime',
            old_name='Quarter',
            new_name='quarter',
        ),
        migrations.RenameField(
            model_name='dimtime',
            old_name='Year',
            new_name='year',
        ),
        migrations.RenameField(
            model_name='factattendance',
            old_name='Absences',
            new_name='absences',
        ),
        migrations.RenameField(
            model_name='factattendance',
            old_name='DepartmentKey',
            new_name='department_key',
        ),
        migrations.RenameField(
            model_name='factattendance',
            old_name='EmployeeKey',
            new_name='employee_key',
        ),
        migrations.RenameField(
            model_name='factattendance',
            old_name='OvertimeHours',
            new_name='overtime_hours',
        ),
        migrations.RenameField(
            model_name='factattendance',
            old_name='TimeKey',
            new_name='time_key',
        ),
        migrations.RenameField(
            model_name='factattendance',
            old_name='TotalHoursWorked',
            new_name='total_hours_worked',
        ),
        migrations.RenameField(
            model_name='factbonusadjustments',
            old_name='AdjustmentAmount',
            new_name='adjustment_amount',
        ),
        migrations.RenameField(
            model_name='factbonusadjustments',
            old_name='AdjustmentType',
            new_name='adjustment_type',
        ),
        migrations.RenameField(
            model_name='factbonusadjustments',
            old_name='EmployeeKey',
            new_name='employee_key',
        ),
        migrations.RenameField(
            model_name='factbonusadjustments',
            old_name='Reason',
            new_name='reason',
        ),
        migrations.RenameField(
            model_name='factbonusadjustments',
            old_name='TimeKey',
            new_name='time_key',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='BaseSalary',
            new_name='base_salary',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='DepartmentKey',
            new_name='department_key',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='EmployeeKey',
            new_name='employee_key',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='NetSalary',
            new_name='net_salary',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='TimeKey',
            new_name='time_key',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='TotalBonuses',
            new_name='total_bonuses',
        ),
        migrations.RenameField(
            model_name='factpayroll',
            old_name='TotalDeductions',
            new_name='total_deductions',
        ),
        migrations.AlterModelTable(
            name='dimdepartments',
            table='dimdepartments',
        ),
        migrations.AlterModelTable(
            name='dimemployees',
            table='dimemployees',
        ),
        migrations.AlterModelTable(
            name='dimtime',
            table='dimtime',
        ),
        migrations.AlterModelTable(
            name='factattendance',
            table='factattendance',
        ),
        migrations.AlterModelTable(
            name='factbonusadjustments',
            table='factbonusadjustments',
        ),
        migrations.AlterModelTable(
            name='factpayroll',
            table='factpayroll',
        ),
    ]
