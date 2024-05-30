import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SavingGoal = ({ monthlyRecord, onSavingsChange }) => {
    const [desiredSavings, setDesiredSavings] = useState(monthlyRecord ? monthlyRecord.desired_savings : 0);
    const [isInputDisabled, setIsInputDisabled] = useState(true);
    const [showInput, setShowInput] = useState(desiredSavings === 0);

    useEffect(() => {
        if (monthlyRecord) {
            setDesiredSavings(monthlyRecord.desired_savings);
            setShowInput(monthlyRecord.desired_savings === 0);
        }
    }, [monthlyRecord]);

    const handleInputChange = (event) => {
        setDesiredSavings(Number(event.target.value));
    };

    const handleButtonClick = () => {
        setIsInputDisabled(false);
        setShowInput(true);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSavingsChange(desiredSavings);
        setIsInputDisabled(true);
        setShowInput(false);
        alert('Se ha establecido un nuevo ahorro objetivo');
    };

    return (
        <Box style={{ display: 'flex', flexDirection: 'column' }} className="setSavingsBox">
            {showInput ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <TextField
                        type="number"
                        label="Ahorro Deseado"
                        value={desiredSavings}
                        onChange={handleInputChange}
                        disabled={isInputDisabled}
                        variant="outlined"
                        InputProps={{
                            inputProps: { min: 0 }
                        }}
                    />
                    {!isInputDisabled && <Button variant="contained" type="submit">Aceptar</Button>}
                </form>
            ) : (
                <>
                    {desiredSavings === 0 ? (
                        <div onClick={handleButtonClick} style={{ cursor: 'pointer', color: 'blue' }}>
                            No se ha detectado un ahorro objetivo. Pulsa aquí para establecerlo.
                        </div>
                    ) : (
                        <>
                            <div>
                              Presupuesto mensual inicial: {monthlyRecord ? (monthlyRecord.total_income - monthlyRecord.fixed_expenses - desiredSavings).toFixed(2) : 0} €
                                <div>Ahorro deseado: {desiredSavings} €</div>
                            </div>
                            <Button variant="outlined" onClick={handleButtonClick}>Cambiar ahorro objetivo</Button>
                        </>
                    )}
                </>
            )}
            <div>Presupuesto mensual final: {monthlyRecord ? (monthlyRecord.total_income - monthlyRecord.fixed_expenses).toFixed(2) : 0} €</div>
        </Box>
    );
};

export default SavingGoal;
