import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Divider, Grid } from "@mui/material";
import { Chart, registerables } from "chart.js";

// Registrar los complementos necesarios para el gráfico
Chart.register(...registerables);

function MonthlyRecord({ record }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!record || isNaN(record.total_income) || record.total_income === 0 || record.total_expense === 0) {
      return;
    }

// Suma de los gastos de cada categoría
const totalVariableExpenses = [
  "total_culture_expenses",
  "total_survival_expenses",
  "total_leisure_expenses",
  "total_extras_expenses",
].reduce((sum, key) => sum + record[key], 0);

// Cálculo de los porcentajes
const percentages = [
  "total_culture_expenses",
  "total_survival_expenses",
  "total_leisure_expenses",
  "total_extras_expenses",
].map((key) => ((record[key] / totalVariableExpenses) * 100).toFixed(2));

    const chart = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Cultura", "Supervivencia", "Ocio y vicio", "Extras"],
        datasets: [{
          data: percentages,
          backgroundColor: ["#06d6a0", "#ffd166", "#118ab2", "#ef476f"],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      chart.destroy();
    };
  }, [record]);

  if (!record || isNaN(record.total_income)) {
    return <Box>Aún no has hecho ningún ingreso</Box>;
  }

  const savingsActualState = record.desired_savings +
      (record.total_income - record.fixed_expenses - record.desired_savings - record.total_expense);

  function renderBiggestCategoryExpense() {
    const maxExpense = findBiggestCategoryExpense();
    const category = maxExpense.type;
    const amount = maxExpense.amount;
    let message = "";
    let color = "";
    switch (category) {
      case "Extras":
        message = "Los extras están bien, pero no cuando eclipsan lo esencial. ¡Tiempo de reajustar! 🛑";
        color = "#ef476f";
        break;
      case "Cultura":
        message = "La cultura es importante, pero no más que tu bienestar. ¡Revisa tus gastos! 📚";
        color = "#06d6a0";
        break;
      case "Supervivencia":
        message = "Bien hecho, priorizar la supervivencia es el primer paso hacia la sabiduría financiera. 👍";
        color = "orange";
        break;
      case "Ocio":
        message = "Tanto gasto en ocio y vicio... espero que al menos estés acumulando puntos de felicidad. 😄";
        color = "#118ab2";
        break;
      default:
        message = "Revisa tus gastos, algo podría estar desbalanceado. 🤔";
        break;
    }
    return (
        <Typography variant="h6" sx={{ color }}>
          {`Mayor tipo de Gasto: ${category}. ${message}`}
        </Typography>
    );
  }

  function findBiggestCategoryExpense() {
    const expenses = [
      { type: "Cultura", amount: record.total_culture_expenses },
      { type: "Supervivencia", amount: record.total_survival_expenses },
      { type: "Ocio", amount: record.total_leisure_expenses },
      { type: "Extras", amount: record.total_extras_expenses },
    ];
    return expenses.reduce((prev, current) => prev.amount > current.amount ? prev : current);
  }

  return (
      <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 2,
            borderRadius: "10px",
            backgroundColor: "#f5f5f5",
            maxHeight: '280px',
          }}
      >
        <Box sx={{ width: '50%' }}>
          <canvas ref={chartRef} style={{ height: '100%', width: '100%' }} />
        </Box>
        <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
        <Box sx={{ width: '50%' }}>
          <Typography variant="h6">
            {savingsActualState > record.desired_savings
                ? `Este mes quieres ahorrar ${record.desired_savings} €, si acabas el mes sin más gastos tu ahorro será incluso mayor, unos ${savingsActualState} € ¡Genial! 👏`
                : `Te habías propuesto ahorrar ${record.desired_savings} €, pero parece que has gastado más de lo previsto. ¡Controla más tus gastos el próximo mes! 🤔`}
          </Typography>
          <Divider sx={{ width: "100%", height: "2px", bgcolor: "primary.main", my: 2 }} />
          {renderBiggestCategoryExpense()}
        </Box>
      </Paper>
  );
}

export default MonthlyRecord;
