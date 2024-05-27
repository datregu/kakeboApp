import React from "react";
import "./MoneyWidget.css"; // Archivo CSS para estilos

const MoneyWidget = ({ amount }) => {
  return (
    <div className="money-widget">
      <div className="label">Total:</div>
      <div className="amount-display">
        <span className="amount">{amount.toFixed(2)}</span>
        <span className="currency">€</span>
      </div>
    </div>
  );
};

export default MoneyWidget;
