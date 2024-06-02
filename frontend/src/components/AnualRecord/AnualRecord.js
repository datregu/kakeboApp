import React, { useEffect, useRef } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Legend,
    Tooltip,
);

const AnualRecord = ({ records }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!records || records.length === 0) {
      return;
    }

    const sortedRecords = records.sort(
        (a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1)
    );
    const labels = sortedRecords.map(record => `${record.year}-${String(record.month).padStart(2, '0')}`);

    const data = {
      labels,
      datasets: [
        {
          label: 'Cultura',
          data: sortedRecords.map(record => record.total_culture_expenses),
          borderColor: '#06d6a0',
          fill: false,
        },
        {
          label: 'Supervivencia',
          data: sortedRecords.map(record => record.total_survival_expenses),
          borderColor: '#ffd166',
          fill: false,
        },
        {
          label: 'Ocio y vicio',
          data: sortedRecords.map(record => record.total_leisure_expenses),
          borderColor: '#118ab2',
          fill: false,
        },
        {
          label: 'Extras',
          data: sortedRecords.map(record => record.total_extras_expenses),
          borderColor: '#ef476f',
          fill: false,
        },
      ],
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Evolución de los tipos de gastos',
          },
        },
      },
    };

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, config);

    return () => chartInstance.current?.destroy();
  }, [records]);

  if (!records) {
    return <Typography variant="body1">Cargando...</Typography>;
  }

  return (
      <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            verticalAlign: 'middle',
            padding: 2,
            borderRadius: '10px',
            backgroundColor: '#f5f5f5',
            maxHeight: '280px',
            width: '95%',
            mx: 'auto',
          }}
      >
        <Typography variant="h6" component="h2" sx={{ color: "#1976d2", textAlign: 'center' }}>
          Resumen Anual
        </Typography>
        <Box sx={{ position: 'relative', flexGrow: 1, minHeight: 0, width: '100%' }}>
          <canvas ref={chartRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        </Box>
      </Paper>
  );
};

export default AnualRecord;
