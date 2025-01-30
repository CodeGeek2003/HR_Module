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
        row.setAttribute("data-id", employee.EmployeeKey);
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
    const tableRow = document.querySelector(`tr[data-id="${id}"]`);
    const cells = tableRow.querySelectorAll("#employees-data td");

    // Check if the row is already in edit mode
    if (tableRow.getAttribute("data-editing") === "true") return;

    // Mark the row as being edited
    tableRow.setAttribute("data-editing", "true");

    // Replace cell content with editable input fields for editable columns
    for (let i = 1; i <= 4; i++) { // Skip Employee ID (index 0)
        const currentValue = cells[i].textContent.trim();
        cells[i].innerHTML = `<input type="text" value="${currentValue}" class="editable-cell" />`;
    }

    // Change "Edit" button to "Save" and add a "Cancel" button
    const actionCell = cells[5];
    actionCell.innerHTML = `
        <button class="save-employee" data-id="${id}">Save</button>
        <button class="cancel-employee" data-id="${id}">Cancel</button>
    `;

    // Attach event listeners to Save and Cancel buttons
    actionCell.querySelector(".save-employee").addEventListener("click", () => saveEmployeeChanges(id));
    actionCell.querySelector(".cancel-employee").addEventListener("click", () => cancelEmployeeEdit(id));
}

// ✅ Save Employee Changes Function
function saveEmployeeChanges(id) {
    const tableRow = document.querySelector(`tr[data-id="${id}"]`);
    const cells = tableRow.querySelectorAll("td");

    const updatedEmployee = {
        EmployeeKey: parseInt(id), // Ensure it's an integer
        FullName: cells[1].querySelector("input").value.trim(),
        BaseSalary: parseFloat(cells[2].querySelector("input").value.trim().replace(/,/g, "")),
        TotalBonuses: parseFloat(cells[3].querySelector("input").value.trim().replace(/,/g, "")),
        TotalDeductions: parseFloat(cells[4].querySelector("input").value.trim().replace(/,/g, ""))
    };

    // Construct SQL UPDATE statement
    const sqlQuery = `
        UPDATE DimEmployees e
            JOIN FactPayroll f ON e.EmployeeKey = f.EmployeeKey
            SET
                e.FullName = '${updatedEmployee.FullName}',
                f.BaseSalary = ${updatedEmployee.BaseSalary},
                f.TotalBonuses = ${updatedEmployee.TotalBonuses},
                f.TotalDeductions = ${updatedEmployee.TotalDeductions}
        WHERE e.EmployeeKey = ${updatedEmployee.EmployeeKey};
    `;

    console.log("Executing SQL:", sqlQuery); // Debugging log

    axios.post("http://127.0.0.1:8000/api/execute_sql/", { queries: [sqlQuery] })
        .then(response => {
            console.log("Update Response:", response.data);

            // Update table display with new values
            cells[1].textContent = updatedEmployee.FullName;
            cells[2].textContent = updatedEmployee.BaseSalary.toLocaleString();
            cells[3].textContent = updatedEmployee.TotalBonuses.toLocaleString();
            cells[4].textContent = updatedEmployee.TotalDeductions.toLocaleString();

            // Reset buttons
            cells[5].innerHTML = `
                <button class="edit-employee">Edit</button>
                <button class="delete-employee">Delete</button>
            `;

            // Reattach event listeners
            attachEventListenersManageEmployees();

            // Mark the row as no longer being edited
            tableRow.setAttribute("data-editing", "false");
        })
        .catch(error => {
            console.error("Error updating employee:", error.response ? error.response.data : error);
            alert("Failed to save changes. Please check the console.");
        });
}
// ✅ Cancel Employee Edit Function
function cancelEmployeeEdit(id) {
    const tableRow = document.querySelector(`tr[data-id="${id}"]`);
    const cells = tableRow.querySelectorAll("td");

    // Restore the original values from the row
    const originalValues = {
        FullName: cells[1].querySelector("input").value,
        BaseSalary: cells[2].querySelector("input").value,
        TotalBonuses: cells[3].querySelector("input").value,
        TotalDeductions: cells[4].querySelector("input").value
    };

    // Reset the cell contents to their original values
    cells[1].textContent = originalValues.FullName;
    cells[2].textContent = parseFloat(originalValues.BaseSalary).toLocaleString();
    cells[3].textContent = parseFloat(originalValues.TotalBonuses).toLocaleString();
    cells[4].textContent = parseFloat(originalValues.TotalDeductions).toLocaleString();

    // Reset the action buttons
    cells[5].innerHTML = `
        <button class="edit-employee" data-id="${id}">Edit</button>
        <button class="delete-employee" data-id="${id}">Delete</button>
    `;

    // Reattach event listeners to the action buttons
    attachEventListenersManageEmployees();

    // Mark the row as no longer being edited
    tableRow.setAttribute("data-editing", "false");
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