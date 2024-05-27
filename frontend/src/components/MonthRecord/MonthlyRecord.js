import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { Chart, registerables } from "chart.js";
import style from "./MonthlyRecord.css";
Chart.register(...registerables);

function MonthlyRecord({ record }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!record || record.total_income === 0) {
      return;
    }

    const chart = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Cultura", "Supervivencia", "Ocio", "Extras"],
        datasets: [
          {
            data: [
              record.total_culture_expenses,
              record.total_survival_expenses,
              record.total_leisure_expenses,
              record.total_extras_expenses,
            ],
            backgroundColor: ["#06d6a0", "#ffd166", "#118ab2", "#ef476f"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      chart.destroy();
    };
  }, [record]);

  if (!record || record.total_income === NaN) {
    return <Box>Aún no has hecho ningún ingreso</Box>;
  }

  const culturePercentage = (
    (record.total_culture_expenses / record.total_expense) *
    100
  ).toFixed(2);
  const survivalPercentage = (
    (record.total_survival_expenses / record.total_expense) *
    100
  ).toFixed(2);
  const leisurePercentage = (
    (record.total_leisure_expenses / record.total_expense) *
    100
  ).toFixed(2);
  const extrasPercentage = (
    (record.total_extras_expenses / record.total_expense) *
    100
  ).toFixed(2);

  return (
    <Box className="information">
      <div>Has ganado {record.total_income} €</div>
      <div>Has tenido unos gastos fijos de {record.fixed_expenses} €</div>
      <b>Te has propuesto ahorrar: {record.desired_savings}</b>
      <div>
        Presupuesto para gastar este mes:{" "}
        {record.total_income - record.fixed_expenses - record.desired_savings} €
      </div>

      <div>Gasto total: {record.total_expense} € (sin fixed)</div>
      <div>
        De tu presupuestos mensual de{" "}
        {record.total_income - record.fixed_expenses - record.desired_savings}{" "}
        €, te queda ya{" "}
        <b>
          {record.total_income -
            record.fixed_expenses -
            record.desired_savings -
            record.total_expense}{" "}
          €
        </b>
      </div>
      <div>
        Este mes querías ahorrar {record.desired_savings} €, si acabas el mes
        sin más gastos ahorrarás{" "}
        <b>
          {record.desired_savings +
            (record.total_income -
              record.fixed_expenses -
              record.desired_savings -
              record.total_expense)}{" "}
          €
        </b>
        .
      </div>
      <br />
      <Box
        style={{
          width: "300px",
          height: "300px",
        }}
      >
        {/* <div>
          Gasto en Cultura: {record.total_culture_expenses} € (
          {culturePercentage}%)
        </div>
        <div>
          Gasto en Supervivencia: {record.total_survival_expenses} € (
          {survivalPercentage}%)
        </div>
        <div>
          Gasto en Ocio: {record.total_leisure_expenses} € ({leisurePercentage}
          %)
        </div>
        <div>
          Gasto en Extras: {record.total_extras_expenses} € ({extrasPercentage}
          %)
        </div>*/}
        <Box>
          <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />
        </Box>
      </Box>
    </Box>
  );
}

export default MonthlyRecord;
