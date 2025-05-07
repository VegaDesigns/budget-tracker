import React from "react";
import { FaTrashAlt } from "react-icons/fa";

// Renders a single transaction row with delete functionality
export default function TransactionItem({ tx, onDelete }) {
  // Determine if this is an expense to adjust styling and sign
  const isExpense = tx.amount < 0;
  const sign = isExpense ? "-" : "+";

  // Format the ISO date string as M/D/YY
  const displayDate = new Date(tx.date).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });

  return (
    <li className={isExpense ? "expense" : "income"}>
      {/* Transaction description */}
      <span className="desc">{tx.description}</span>

      {/* Transaction amount with sign */}
      <span className="amount">
        {sign}${Math.abs(tx.amount).toFixed(2)}
      </span>

      {/* Category badge */}
      <span className="category-badge">{tx.category}</span>

      {/* Date of transaction */}
      <span className="date">{displayDate}</span>

      {/* Delete button */}
      <div className="actions">
        <button onClick={() => onDelete(tx.id)}>
          <FaTrashAlt size={14} />
        </button>
      </div>
    </li>
  );
}
