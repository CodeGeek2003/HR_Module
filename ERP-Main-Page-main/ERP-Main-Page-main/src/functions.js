import axios from 'axios';

function emp_salary(){
    let sqlQuery = [` SELECT e.FullName, e.Role, f.BaseSalary 
                        FROM dimemployees e 
                        JOIN factpayroll f ON e.EmployeeKey = f.EmployeeKey 
                        order by f.BaseSalary DESC`];

    axios.post('http://127.0.0.1:8000/api/execute_sql/', {
        queries: sqlQuery
    })
        .then(response => {
            // Log the formatted JSON result
            console.log('Query Result:', JSON.stringify(response.data, null, 2));
            return JSON.stringify(response.data, null, 2)
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
emp_salary()