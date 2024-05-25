import React from 'react';
import { Box } from '@mui/material';

function MonthlyRecord({ record }) {
    if (!record) {
        return <div>Loading...</div>; // Or your loading spinner
    }

    if (record.total_income === 0) {
        return <div>Registra un nuevo ingreso este mes para comenzar la planificacion de este mes</div>;
    }


    const infoRecordMonth = {
        render: function() {
            return (
                <Box>
                    <div>Gastos fijos: {record.fixed_expenses}</div>
                    <div>Ingreso total: {record.total_income}</div>
                    <div>Gasto total: {record.total_expense}</div>
                    <div>Ahorros deseados: {record.desired_savings}</div>
                    <div>Ahorros reales: {record.real_savings}</div>
                </Box>
            );
        }
    }
    return (
        <Box>

            <div>Has ganado {record.total_income} €</div>
            <div>Has tenido unos gastos fijos de {record.fixed_expenses} €</div>
            <div>Gasto total: {record.total_expense}</div>
            <div>Presupuesto para el mes: {record.real_savings - record.desired_savings}</div>
            <div> De los {record.total_income} € que has ingresado este mes, has gastado ya <b>{record.fixed_expenses + record.total_expense} € </b> entre gastos fijos y nornamles</div>
            <div>Este mes querías ahorrar {record.desired_savings} €, si acabas el mes sin más gastos ahorraras <b>{record.real_savings} €</b>.</div>

        </Box>
    );
}

export default MonthlyRecord;