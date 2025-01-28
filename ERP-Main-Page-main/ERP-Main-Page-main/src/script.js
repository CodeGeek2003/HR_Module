// Function to dynamically load sections
function loadSection(section) {
    const sections = {
        'manage-employee': document.getElementById('manage-employee'),
        'time-sheet': document.getElementById('sheet'),
        'employee-tasks': document.getElementById('employee_tasks'),
        'manage-payroll': document.getElementById('manage-payroll')
    };

    const dynamicContent = document.getElementById('dynamic-content');

    // Hide all sections
    Object.values(sections).forEach(sec => sec && sec.classList.add('d-none'));

    // Show the selected section
    if (sections[section]) {
        sections[section].classList.remove('d-none');
        attachEventListeners(section); // Attach event listeners dynamically
    } else {
        console.error(`Section "${section}" does not exist.`);
    }
}

// Attach event listeners based on the section
function attachEventListeners(section) {
    if (section === 'manage-employee') {
        document.querySelectorAll('.edit-employee').forEach(button => {
            button.addEventListener('click', () => editEmployee(button.dataset.id));
        });
        document.querySelectorAll('.delete-employee').forEach(button => {
            button.addEventListener('click', () => deleteEmployee(button.dataset.id));
        });
    } else if (section === 'time-sheet') {
        const startBtn = document.getElementById('start-btn');
        const endBtn = document.getElementById('end-btn');

        startBtn?.addEventListener('click', startTimer);
        endBtn?.addEventListener('click', endTimer);
    } else if (section === 'manage-payroll') {
        // Add payroll-specific event listeners here if needed
    }
}

// Employee management functions
function editEmployee(employeeId) {
    alert(`Edit Employee ${employeeId} triggered!`);
}

function deleteEmployee(employeeId) {
    alert(`Delete Employee ${employeeId} triggered!`);
}

// Timer functions for the time sheet
let timerInterval;
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

// Bonus and deduction management for payroll
function addBonus(employeeId) {
    const bonusElement = document.getElementById(`bonus-${employeeId}`);
    const totalElement = document.getElementById(`total-${employeeId}`);

    const bonus = parseFloat(prompt('Enter bonus amount:', '0')) || 0;
    const currentBonus = parseFloat(bonusElement.textContent.replace('$', '')) || 0;
    const currentTotal = parseFloat(totalElement.textContent.replace('$', '')) || 0;

    bonusElement.textContent = `$${(currentBonus + bonus).toFixed(2)}`;
    totalElement.textContent = `$${(currentTotal + bonus).toFixed(2)}`;
}

function makeDeduction(employeeId) {
    const deductionElement = document.getElementById(`deduction-${employeeId}`);
    const totalElement = document.getElementById(`total-${employeeId}`);

    const deduction = parseFloat(prompt('Enter deduction amount:', '0')) || 0;
    const currentDeduction = parseFloat(deductionElement.textContent.replace('$', '')) || 0;
    const currentTotal = parseFloat(totalElement.textContent.replace('$', '')) || 0;

    deductionElement.textContent = `$${(currentDeduction + deduction).toFixed(2)}`;
    totalElement.textContent = `$${(currentTotal - deduction).toFixed(2)}`;
}
