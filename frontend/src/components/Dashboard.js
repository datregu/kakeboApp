import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/expenseList')
      .then(response => response.json())
      .then(data => setExpenses(data.slice(0, 10))) // Tomamos solo los primeros 10 elementos
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(expense => (
          <tr key={expense.expenseId}>
            <td>{expense.expenseId}</td>
            <td>{expense.expenseAmount}</td>
            <td>{expense.expenseDate}</td>
            <td>{expense.expenseDescription}</td>
            <td>{expense.expenseCategory}</td>
            <td>{expense.user}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Dashboard;