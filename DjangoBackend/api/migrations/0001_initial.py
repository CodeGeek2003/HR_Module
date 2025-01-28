# Generated by Django 5.1.5 on 2025-01-25 06:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DimDepartments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('DepartmentID', models.IntegerField(unique=True)),
                ('DepartmentName', models.CharField(max_length=100)),
                ('ManagerID', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='DimEmployees',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('EmployeeID', models.IntegerField(unique=True)),
                ('FullName', models.CharField(max_length=100)),
                ('Role', models.CharField(max_length=50)),
                ('Gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], max_length=10)),
                ('Country', models.CharField(max_length=50)),
                ('HireDate', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='DimTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Date', models.DateField(unique=True)),
                ('Year', models.IntegerField()),
                ('Quarter', models.IntegerField()),
                ('Month', models.IntegerField()),
                ('Day', models.IntegerField()),
                ('DayOfWeek', models.CharField(max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='FactAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('TotalHoursWorked', models.DecimalField(decimal_places=2, max_digits=5)),
                ('Absences', models.IntegerField()),
                ('OvertimeHours', models.DecimalField(decimal_places=2, max_digits=5)),
                ('DepartmentKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimdepartments')),
                ('EmployeeKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimemployees')),
                ('TimeKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimtime')),
            ],
        ),
        migrations.CreateModel(
            name='FactBonusAdjustments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('AdjustmentType', models.CharField(choices=[('Bonus', 'Bonus'), ('Deduction', 'Deduction')], max_length=10)),
                ('AdjustmentAmount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('Reason', models.CharField(max_length=255)),
                ('EmployeeKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimemployees')),
                ('TimeKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimtime')),
            ],
        ),
        migrations.CreateModel(
            name='FactPayroll',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('BaseSalary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('TotalBonuses', models.DecimalField(decimal_places=2, max_digits=10)),
                ('TotalDeductions', models.DecimalField(decimal_places=2, max_digits=10)),
                ('NetSalary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('DepartmentKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimdepartments')),
                ('EmployeeKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimemployees')),
                ('TimeKey', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.dimtime')),
            ],
        ),
    ]
