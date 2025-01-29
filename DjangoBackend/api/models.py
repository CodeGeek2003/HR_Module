from django.db import models

# Dimension Table: Employees
class DimEmployees(models.Model):
    employee_id = models.IntegerField(unique=True, db_column='employeekey', primary_key=True)
    full_name = models.CharField(max_length=100, db_column='fullname')
    role = models.CharField(max_length=50, db_column='role')
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], db_column='gender')
    country = models.CharField(max_length=50, db_column='country')
    hire_date = models.DateField(db_column='hiredate')
    department_key = models.ForeignKey('DimDepartments', on_delete=models.CASCADE, db_column='departmentkey')

    def __str__(self):
        return self.full_name

    class Meta:
        db_table = 'dimemployees'
        managed = False

# Dimension Table: Departments
class DimDepartments(models.Model):
    department_id = models.IntegerField(unique=True, db_column='departmentkey', primary_key=True)
    department_name = models.CharField(max_length=100, db_column='departmentname')
    manager_id = models.IntegerField(db_column='managerid')

    def __str__(self):
        return self.department_name

    class Meta:
        db_table = 'dimdepartments'
        managed = False

# Dimension Table: Time
class DimTime(models.Model):
    time_key = models.AutoField(primary_key=True, db_column='timekey')
    date = models.DateField(unique=True, db_column='date')
    year = models.IntegerField(db_column='year')
    quarter = models.IntegerField(db_column='quarter')
    month = models.IntegerField(db_column='month')
    day = models.IntegerField(db_column='day')
    day_of_week = models.CharField(max_length=15, db_column='dayofweek')

    def __str__(self):
        return str(self.date)

    class Meta:
        db_table = 'dimtime'
        managed = False

# Fact Table: Payroll
class FactPayroll(models.Model):
    payroll_key = models.AutoField(primary_key=True, db_column='payrollkey')
    employee_key = models.ForeignKey(DimEmployees, on_delete=models.CASCADE, db_column='employeekey')
    department_key = models.ForeignKey(DimDepartments, on_delete=models.CASCADE, db_column='departmentkey')
    time_key = models.ForeignKey(DimTime, on_delete=models.CASCADE, db_column='timekey')
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, db_column='basesalary')
    total_bonuses = models.DecimalField(max_digits=10, decimal_places=2, db_column='totalbonuses')
    total_deductions = models.DecimalField(max_digits=10, decimal_places=2, db_column='totaldeductions')
    net_salary = models.DecimalField(max_digits=10, decimal_places=2, db_column='netsalary')

    class Meta:
        db_table = 'factpayroll'
        managed = False

# Fact Table: Attendance
class FactAttendance(models.Model):
    attendance_key = models.AutoField(primary_key=True, db_column='attendancekey')
    employee_key = models.ForeignKey(DimEmployees, on_delete=models.CASCADE, db_column='employeekey')
    time_key = models.ForeignKey(DimTime, on_delete=models.CASCADE, db_column='timekey')
    department_key = models.ForeignKey(DimDepartments, on_delete=models.CASCADE, db_column='departmentkey')
    total_hours_worked = models.DecimalField(max_digits=5, decimal_places=2, db_column='totalhoursworked')
    absences = models.IntegerField(db_column='absences')
    overtime_hours = models.DecimalField(max_digits=5, decimal_places=2, db_column='overtimehours')

    class Meta:
        db_table = 'factattendance'
        managed = False

# Fact Table: Bonus Adjustments
class FactBonusAdjustments(models.Model):
    adjustment_key = models.AutoField(primary_key=True, db_column='adjustmentkey')
    employee_key = models.ForeignKey(DimEmployees, on_delete=models.CASCADE, db_column='employeekey')
    time_key = models.ForeignKey(DimTime, on_delete=models.CASCADE, db_column='timekey')
    adjustment_type = models.CharField(max_length=10, choices=[('Bonus', 'Bonus'), ('Deduction', 'Deduction')], db_column='adjustmenttype')
    adjustment_amount = models.DecimalField(max_digits=10, decimal_places=2, db_column='adjustmentamount')
    reason = models.CharField(max_length=255, db_column='reason')

    class Meta:
        db_table = 'factbonusadjustments'
        managed = False

# Table: Timesheet
class Timesheet(models.Model):
    entry_id = models.AutoField(primary_key=True, db_column='entryid')
    entry_name = models.CharField(max_length=100, db_column='entryname')
    start_time = models.DateTimeField(db_column='starttime')
    end_time = models.DateTimeField(db_column='endtime')
    employee_key = models.ForeignKey(DimEmployees, on_delete=models.CASCADE, db_column='employeekey')
    time_key = models.ForeignKey(DimTime, on_delete=models.CASCADE, db_column='timekey')

    class Meta:
        db_table = 'timesheet'
        managed = False
