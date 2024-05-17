import React, { useEffect, useState } from 'react';
import ExpenseTable from '../../components/ExpenseTable/ExpenseTable';
function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/expenseList')
      .then(response => response.json())
      .then(data => setExpenses(data.slice(0, 10))) // Tomamos solo los primeros 10 elementos
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <ExpenseTable expenses={expenses} tableSize={{width: '700px'}} />
  );
}

export default Dashboard;