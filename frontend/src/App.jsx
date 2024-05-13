import * as React from 'react';
import { DataGrid }  from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState([]); // Initialize data as an empty array

    useEffect(() => {
        fetch('http://localhost:8080/api/expenseList')
            .then(response => {
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                return response.json();
            })
            .then(data => setData(data))
            .catch(error => console.log('Fetch error: ', error));
    }, []);

    const columns = [
        { field: 'expenseId', headerName: 'ID', width: 70 },
        { field: 'expenseAmount', headerName: 'Amount', width: 130 },
        { field: 'expenseDate', headerName: 'Date', width: 130 },
        { field: 'expenseDescription', headerName: 'Description', width: 130 },
        { field: 'expenseCategory', headerName: 'Category', width: 130 },
        { field: 'user', headerName: 'User', width: 130 },
    ];

    return (
        <div style={{ height: 400, width: '100%', alignContent: 'center' }}>
            <DataGrid
                style={{ color: 'grey' }}
                getRowId={(row) => row.expenseId}
                rows={data} columns={columns} pageSize={5} />
        </div>
    );
}

export default App;