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
