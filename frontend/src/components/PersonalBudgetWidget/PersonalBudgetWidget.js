import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const PersonalBudgetWidget = ({ amount }) => {
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysRemaining = (lastDayOfMonth - currentDate) / (1000 * 60 * 60 * 24);
    const weeksRemaining = daysRemaining / 7;
    const weeklyBudget = amount / daysRemaining;

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 2,
                borderRadius: '10px',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
            }}
        >
            <Typography variant="h6" component="h2" sx={{ color: '#1976d2' }}>
                Presupuesto Personal
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <CircularProgress variant="determinate" value={(daysRemaining / lastDayOfMonth.getDate()) * 100} size={60} />
                <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" component="div">
                        €{amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Ingresos Totales
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h4" component="div" sx={{ color: '#d32f2f' }}>
                    {daysRemaining.toFixed(0)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Días para acabar el mes
                </Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h4" component="div" sx={{ color: '#388e3c' }}>
                    €{weeklyBudget.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Presupuesto Semanal
                </Typography>
            </Box>
        </Paper>
    );
};

export default PersonalBudgetWidget;