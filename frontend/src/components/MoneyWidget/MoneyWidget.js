import React from "react";
import "./MoneyWidget.css"; // Archivo CSS para estilos

const MoneyWidget = ({ amount }) => {
    const formattedAmount = amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="money-widget">
            <div className="label">Total:{'   '}</div>
            <div className="amount-display">
                <span className="amount">{formattedAmount}</span>
                <span className="currency">€</span>
            </div>
        </div>
    );
};

export default MoneyWidget;