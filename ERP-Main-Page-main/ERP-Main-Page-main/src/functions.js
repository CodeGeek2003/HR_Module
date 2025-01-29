// Function to load the selected section dynamically
function loadSection(section) {
    const sections = {
        'manage-employee': document.getElementById('manage-employee'),
        'time-sheet': document.getElementById('sheet'),
        'employee-tasks': document.getElementById('employee-tasks'),
        'manage-payroll': document.getElementById('manage-payroll')
    };

    // Hide all sections
    Object.values(sections).forEach(sec => sec && sec.classList.add('d-none'));

    // Show the selected section
    if (sections[section]) {
        sections[section].classList.remove('d-none');
        attachEventListeners(section);
        // ✅ Call the function only when managing tasks
        if (section === 'employee-tasks') {
            console.log('calling tasks data')
            tasks_data();
        }

        // ✅ Call the function only when managing employees
        else if (section === 'manage-employee') {
            employees_data();
        }
        else if (section === 'manage-payroll'){

            payroll_data()
        }
    } else {
        console.error(`Section "${section}" does not exist.`);
    }
}

// ✅ Function to fetch employee salary data from API
function employees_data() {
    let sqlQuery = [`SELECT e.EmployeeKey, e.FullName, f.BaseSalary, f.TotalDeductions, f.TotalBonuses 
                     FROM DimEmployees e 
                     JOIN FactPayroll f ON e.EmployeeKey = f.EmployeeKey 
                     ORDER BY f.BaseSalary DESC`];

    axios.post('http://127.0.0.1:8000/api/execute_sql/', {
        queries: sqlQuery
    })
        .then(response => {
            const employees = response.data;
            // console.log('Query Result:', JSON.stringify(employees, null, 2));
            populateManageEmployeesTable(employees);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// ✅ Function to populate the employee data table
function populateManageEmployeesTable(employees) {
    const tableBody = document.querySelector("#employees-data tbody");

    tableBody.innerHTML = ""; // Clear previous data
    employees = employees[0].result;
    console.log(employees);
    employees.forEach(employee => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.EmployeeKey}</td>
            <td>${employee.FullName}</td>
            <td>${employee.BaseSalary.toLocaleString()}</td>
            <td>${employee.TotalBonuses.toLocaleString()}</td>
            <td>${employee.TotalDeductions.toLocaleString()}</td>
            <td>
                <button class="edit-employee" data-id="${employee.EmployeeKey}">Edit</button>
                <button class="delete-employee" data-id="${employee.EmployeeKey}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    attachEventListenersManageEmployees(); // Ensure event listeners are re-attached
}

// ✅ Function to attach event listeners to Edit and Delete buttons
function attachEventListenersManageEmployees() {
    document.querySelectorAll(".edit-employee").forEach(button => {
        button.addEventListener("click", function () {
            const employeeId = this.getAttribute("data-id");
            editEmployeeManageEmployees(employeeId);
        });
    });

    document.querySelectorAll(".delete-employee").forEach(button => {
        button.addEventListener("click", function () {
            const employeeId = this.getAttribute("data-id");
            deleteEmployeeManageEmployees(employeeId);
        });
    });
}

// ✅ Edit Employee function
function editEmployeeManageEmployees(id) {
    alert(`Edit Employee ID: ${id}`);
    // Here, you can implement modal pop-ups or other UI to edit employee details
}

// ✅ Delete Employee function
function deleteEmployeeManageEmployees(id) {
    if (confirm(`Are you sure you want to delete Employee ID: ${id}?`)) {
        alert(`Employee ID ${id} deleted.`);
        // Implement delete functionality (e.g., send DELETE request to API)
    }
}

// ✅ Function to attach general event listeners for different sections
function attachEventListeners(section) {
     if (section === 'time-sheet') {
        const startBtn = document.getElementById('start-btn');
        const endBtn = document.getElementById('end-btn');

        startBtn?.addEventListener('click', startTimer);
        endBtn?.addEventListener('click', endTimer);
    }
}

// ✅ Function to start a timer (Time Sheet feature)
function startTimer() {
    const startBtn = document.getElementById('start-btn');
    const endBtn = document.getElementById('end-btn');
    const timer = document.getElementById('timer');

    if (!timer || !startBtn || !endBtn) {
        console.error('Timer or buttons not found.');
        return;
    }

    const startTime = new Date();
    timerInterval = setInterval(() => {
        const elapsed = new Date() - startTime;
        const hours = String(Math.floor(elapsed / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0');
        timer.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);

    startBtn.disabled = true;
    endBtn.disabled = false;
}

// ✅ Function to stop the timer and record time (Time Sheet feature)
function endTimer() {
    clearInterval(timerInterval);

    const timer = document.getElementById('timer');
    const taskName = document.getElementById('task-name').value || 'N/A';
    const projectName = document.getElementById('project-dropdown').value || 'N/A';
    const recordedTasks = document.getElementById('recorded-tasks');

    if (!timer || !recordedTasks) {
        console.error('Timer or recorded tasks not found.');
        return;
    }

    const duration = timer.textContent;
    const taskRecord = `
        <tr>
            <td>${taskName}</td>
            <td>${projectName}</td>
            <td>${duration}</td>
        </tr>
    `;
    recordedTasks.innerHTML += taskRecord;

    // Reset the timer
    timer.textContent = '00:00:00';
    document.getElementById('start-btn').disabled = false;
    document.getElementById('end-btn').disabled = true;
}

function tasks_data(){
    let sqlQuery = [`SELECT
                         e.FullName,
                         GROUP_CONCAT(t.EntryName SEPARATOR ', ') AS AssignedTasks
                            FROM DimEmployees e
                              JOIN TimeSheet t ON e.EmployeeKey = t.EmployeeKey
                     GROUP BY e.FullName;`];

    axios.post('http://127.0.0.1:8000/api/execute_sql/', {
        queries: sqlQuery
    })
        .then(response => {
            const employees = response.data;
            // console.log('Query Result:', JSON.stringify(employees, null, 2));
            console.log('calling populateTasksData')
            populateTasksData(employees) ;
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

function populateTasksData(employees) {
    const tableBody = document.querySelector("#emp-tasks-table tbody");
    console.log('calling tasks tableBody')
    tableBody.innerHTML = ""; // Clear previous data
    employees = employees[0].result;
    console.log(employees);
    employees.forEach(employee => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.FullName}</td>
            <td>${employee.AssignedTasks}</td>
        `;

        tableBody.appendChild(row);
    });


}

function payroll_data(){
    let sqlQuery = [`SELECT
                         e.EmployeeKey,
                         e.FullName AS FullName,  -- Using MAX to ensure a single value per EmployeeKey
                         SUM(ts.EndTime - ts.StartTime) AS Total_Hours,
                         SUM(f.BaseSalary) AS BaseSalary,
                         SUM(f.TotalBonuses) AS Bonus,
                         SUM(f.TotalDeductionS) AS Deduction,
                         SUM(f.BaseSalary + f.TotalBonuses - f.TotalDeductionS) AS Total_Salary  -- Ensure correct aggregation
                     FROM factpayroll f
                              JOIN dimemployees e ON f.EmployeeKey = e.EmployeeKey
                              JOIN dimtime t ON f.TimeKey = t.TimeKey
                              JOIN timesheet ts ON t.TimeKey = ts.TimeKey
                     GROUP BY e.EmployeeKey
                     ORDER BY e.EmployeeKey`];

    axios.post('http://127.0.0.1:8000/api/execute_sql/', {
        queries: sqlQuery
    })
        .then(response => {
            const employees = response.data;
            // console.log('Query Result:', JSON.stringify(employees, null, 2));
            console.log('calling populateTasksData')
            populatePayrollData(employees) ;
        })
        .catch(error => {
            console.error('Error:', error);
        })
}

function populatePayrollData(employees) {
    const tableBody = document.querySelector("#payroll_table_data tbody");
    console.log('calling payroll tableBody')
    tableBody.innerHTML = ""; // Clear previous data
    employees = employees[0].result;
    console.log(employees);
    employees.forEach(employee => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${employee.EmployeeKey}</td>
            <td>${employee.FullName}</td>
            <td>${employee.Total_Hours}</td>
            <td>${employee.BaseSalary}</td>
            <td>${employee.Bonus}</td>
            <td>${employee.Deduction}</td>
            <td>${employee.Total_Salary}</td>
        `;

        tableBody.appendChild(row);
    });


}
