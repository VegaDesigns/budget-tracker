import React, { useState } from "react";
import { useBudget } from "./context/BudgetContext";
import { FaSun, FaMoon } from "react-icons/fa";
import BudgetChart from "./components/BudgetChart";
import TransactionForm from "./components/TransactionForm";
import TransactionItem from "./components/TransactionItem";

export default function App() {
  // pull global state & dispatch from context
  const { state, dispatch } = useBudget();
  const { transactions, monthlyBudget, theme } = state;

  // local UI filter
  const [filter, setFilter] = useState("all");

  /* ---------- derived totals ---------- */
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const filteredTx =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  /* ---------- handlers (dispatch wrappers) ---------- */
  const addTx = (tx) => dispatch({ type: "ADD_TX", payload: tx });
  const delTx = (id) => dispatch({ type: "DELETE_TX", payload: id });
  const setBudget = (n) => dispatch({ type: "SET_BUDGET", payload: n });
  const toggleTh = () => dispatch({ type: "TOGGLE_THEME" });

  /* ---------- CSV export (uses transactions) ---------- */
  const exportCSV = () => {
    if (!transactions.length) return alert("No transactions to export.");
    const headers = ["Description", "Amount", "Type", "Category", "Date"];
    const rows = transactions.map((t) => [
      `"${t.description}"`,
      t.amount,
      t.amount < 0 ? "Expense" : "Income",
      t.category,
      t.date,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    link.click();
  };

  /* ---------- render ---------- */
  return (
    <div className="container">
      {/* header */}
      <div className="header-bar">
        <h1>Budget Tracker</h1>
        <div className="header-actions">
          <button onClick={exportCSV}>Export CSV</button>

          <label className="toggle-switch" title="Toggle dark mode">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTh}
            />
            <span className="slider">
              <FaSun className="icon sun" />
              <FaMoon className="icon moon" />
            </span>
          </label>
        </div>
      </div>

      {/* summary cards */}
      <div className="summary">
        <div>
          <strong>Balance:</strong> ${(income - expense).toFixed(2)}
        </div>
        <div>
          <strong>Income:</strong> ${income.toFixed(2)}
        </div>
        <div>
          <strong>Expenses:</strong> ${expense.toFixed(2)}
        </div>
      </div>

      {/* chart */}
      <div className="chart-container">
        <BudgetChart income={income} expenses={expense} />
      </div>

      {/* category filter */}
      <div className="filters">
        <label htmlFor="filter">Filter</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="salary">Salary</option>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="entertainment">Entertainment</option>
          <option value="misc">Misc</option>
        </select>
      </div>

      {/* monthly budget card */}
      <div className="card budget-goal-card">
        <h2>Monthly Budget</h2>
        <form
          id="budget-form"
          onSubmit={(e) => {
            e.preventDefault();
            const val = parseFloat(e.target.budget.value);
            if (val > 0) setBudget(val);
            e.target.reset();
          }}
        >
          <input
            name="budget"
            type="number"
            min="1"
            placeholder="Set budget…"
            required
          />
          <button className="budget-btn">Set Budget</button>
        </form>

        <div className="budget-status">
          {monthlyBudget !== null ? (
            <>
              <p id="budget-summary">
                ${expense.toFixed(2)} of ${monthlyBudget.toFixed(2)} spent (
                {Math.min((expense / monthlyBudget) * 100, 100).toFixed(0)}%)
              </p>
              <div className="budget-progress">
                <div
                  className="budget-bar-fill"
                  style={{
                    width: `${Math.min((expense / monthlyBudget) * 100, 100)}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <p id="budget-summary">No budget set yet.</p>
          )}
        </div>
      </div>

      {/* transaction form */}
      <TransactionForm onAdd={addTx} />

      {/* transaction list */}
      <ul className="transactions">
        {filteredTx.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} onDelete={delTx} />
        ))}
      </ul>
    </div>
  );
}
