import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend, Tooltip);

const AnualRecord = ({ records }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!records || records.length === 0) {
            return;
        }

        // Sort records by year and month
        const sortedRecords = records.sort((a, b) => new Date(a.year, a.month - 1) - new Date(b.year, b.month - 1));
        const labels = sortedRecords.map(record => `${record.year}-${record.month}`);

        const data = {
            labels,
            datasets: [
                {
                    label: 'Total Culture Expenses',
                    data: sortedRecords.map(record => record.total_culture_expenses),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    fill: false,
                },
                {
                    label: 'Total Survival Expenses',
                    data: sortedRecords.map(record => record.total_survival_expenses),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                },
                {
                    label: 'Total Leisure Expenses',
                    data: sortedRecords.map(record => record.total_leisure_expenses),
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false,
                },
                {
                    label: 'Total Extras Expenses',
                    data: sortedRecords.map(record => record.total_extras_expenses),
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: false,
                },
            ],
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Evolucion de los tipos de gastos',
                    },
                },
            },
        };

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(chartRef.current, config);

        // Cleanup function to destroy chart instance on unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [records]);

    if (!records) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Anual Record</h2>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default AnualRecord;
