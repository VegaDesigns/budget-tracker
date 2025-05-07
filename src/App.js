import React, { useState, useEffect } from "react";
import BudgetChart from "./components/BudgetChart";
import TransactionItem from "./components/TransactionItem";
import TransactionForm from "./components/TransactionForm";
import { FaSun, FaMoon } from "react-icons/fa";

function App() {
  // Load persisted state or use defaults
  const [transactions, setTransactions] = useState(() => {
    const s = localStorage.getItem("transactions");
    return s ? JSON.parse(s) : [];
  });
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    const s = localStorage.getItem("monthlyBudget");
    return s ? JSON.parse(s) : null;
  });
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  // Persist transactions whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Persist budget whenever it changes
  useEffect(() => {
    if (monthlyBudget !== null) {
      localStorage.setItem("monthlyBudget", JSON.stringify(monthlyBudget));
    }
  }, [monthlyBudget]);

  // Apply theme and persist it
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Filter transactions by category
  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.category === filter);

  // Add a new transaction
  const addTransaction = (tx) => setTransactions((prev) => [...prev, tx]);

  // Delete an existing transaction
  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  // Handle category filter change
  const handleFilter = (e) => setFilter(e.target.value);

  // Set a new monthly budget
  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(e.target.budget.value);
    if (val > 0) setMonthlyBudget(val);
    e.target.reset();
  };

  // Export all transactions as CSV
  const exportCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
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

  return (
    <div className="container">
      {/* Header */}
      <div className="header-bar">
        <h1>Budget Tracker</h1>
        <div className="header-actions">
          <button onClick={exportCSV}>Export CSV</button>
          <label className="toggle-switch" title="Toggle dark mode">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={() =>
                setTheme((t) => (t === "light" ? "dark" : "light"))
              }
            />
            <span className="slider">
              {/* show ☀️ in light mode, 🌙 in dark mode */}
              {theme === "dark" ? <FaMoon /> : <FaSun />}
            </span>
          </label>
        </div>
      </div>

      {/* Summary */}
      <div className="summary">
        <div>
          <strong>Balance:</strong> ${(totalIncome - totalExpenses).toFixed(2)}
        </div>
        <div>
          <strong>Income:</strong> ${totalIncome.toFixed(2)}
        </div>
        <div>
          <strong>Expenses:</strong> ${totalExpenses.toFixed(2)}
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <BudgetChart income={totalIncome} expenses={totalExpenses} />
      </div>

      {/* Filter */}
      <div className="filters">
        <label htmlFor="filter">Filter by Category</label>
        <select id="filter" value={filter} onChange={handleFilter}>
          <option value="all">All</option>
          <option value="salary">Salary</option>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="entertainment">Entertainment</option>
          <option value="misc">Misc</option>
        </select>
      </div>

      {/* Budget Goal */}
      <div className="card budget-goal-card">
        <h2>Monthly Budget Goal</h2>
        <form id="budget-form" onSubmit={handleBudgetSubmit}>
          <input
            name="budget"
            type="number"
            placeholder="Set your monthly budget..."
            min="1"
            required
          />
          <button type="submit" className="budget-btn">
            Set Budget
          </button>
        </form>
        <div className="budget-status">
          {monthlyBudget ? (
            <>
              <p id="budget-summary">
                ${totalExpenses.toFixed(2)} of ${monthlyBudget.toFixed(2)} spent
                (
                {Math.min((totalExpenses / monthlyBudget) * 100, 100).toFixed(
                  0
                )}
                % )
              </p>
              <div className="budget-progress">
                <div
                  id="budget-bar"
                  className="budget-bar-fill"
                  style={{
                    width: `${Math.min(
                      (totalExpenses / monthlyBudget) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <p id="budget-summary">No budget set yet.</p>
          )}
        </div>
      </div>

      {/* Form & List */}
      <TransactionForm onAdd={addTransaction} />
      <ul className="transactions">
        {filteredTransactions.map((tx) => (
          <TransactionItem key={tx.id} tx={tx} onDelete={deleteTransaction} />
        ))}
      </ul>
    </div>
  );
}

export default App;
