// src/App.js
import React, { useState, useMemo } from "react";
import { useBudget } from "./context/BudgetContext";
import Sidebar from "./components/Sidebar";
import BalanceTrend from "./components/BalanceTrend";
import TransactionForm from "./components/TransactionForm";
import TransactionItem from "./components/TransactionItem";

// Import the avatar asset
import userAvatar from "./assets/avatar.png";

// — Demo dataset for the 30-day trend chart
const DEMO_TRANSACTIONS = [
  {
    id: 1,
    description: "Salary",
    amount: 3000,
    category: "salary",
    date: new Date("2025-04-01").getTime(),
  },
  {
    id: 2,
    description: "Rent",
    amount: -1200,
    category: "rent",
    date: new Date("2025-04-05").getTime(),
  },
  {
    id: 3,
    description: "Freelance",
    amount: 800,
    category: "salary",
    date: new Date("2025-04-10").getTime(),
  },
  {
    id: 4,
    description: "Groceries",
    amount: -200,
    category: "food",
    date: new Date("2025-04-12").getTime(),
  },
  {
    id: 5,
    description: "Utilities",
    amount: -150,
    category: "bills",
    date: new Date("2025-04-18").getTime(),
  },
  {
    id: 6,
    description: "Transport",
    amount: -100,
    category: "misc",
    date: new Date("2025-04-20").getTime(),
  },
  {
    id: 7,
    description: "Dining Out",
    amount: -80,
    category: "food",
    date: new Date("2025-04-22").getTime(),
  },
  {
    id: 8,
    description: "Bonus",
    amount: 500,
    category: "salary",
    date: new Date("2025-04-25").getTime(),
  },
];

export default function App() {
  // — Context API state & dispatch
  const {
    state: { transactions, theme },
    dispatch,
  } = useBudget();

  // — Local UI state
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // — Derived totals
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [transactions]
  );

  // — Filtered transactions
  const filteredTransactions = useMemo(
    () => transactions.filter((t) => filter === "all" || t.category === filter),
    [transactions, filter]
  );

  // — Compute 30-day running balances
  const dailyBalances = useMemo(() => {
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - 29);

    const dates = [];
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    const sorted = [...DEMO_TRANSACTIONS].sort((a, b) => a.date - b.date);
    let running = 0;
    const result = dates.map((d) => {
      const cutoff = new Date(d).setHours(23, 59, 59, 999);
      sorted.forEach((tx) => {
        if (tx.date <= cutoff && !tx._counted) {
          running += tx.amount;
          tx._counted = true;
        }
      });
      return {
        date: d.toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric",
        }),
        balance: running,
      };
    });
    sorted.forEach((tx) => delete tx._counted);
    return result;
  }, []);

  // — Handlers
  const handleAddTransaction = (tx) =>
    dispatch({ type: "ADD_TX", payload: tx });
  const handleDeleteTransaction = (id) =>
    dispatch({ type: "DELETE_TX", payload: id });
  const handleToggleTheme = () => dispatch({ type: "TOGGLE_THEME" });
  const handleExportCSV = () => {
    if (!transactions.length) return alert("No transactions to export.");
    const headers = ["Description", "Amount", "Type", "Category", "Date"];
    const rows = transactions.map((t) => [
      `"${t.description}"`,
      t.amount,
      t.amount < 0 ? "Expense" : "Income",
      t.category,
      new Date(t.date).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transactions.csv";
    link.click();
  };

  return (
    <div className={`app-layout ${theme}`}>
      {/* Mobile toggle for sidebar */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((o) => !o)}
      >
        ☰
      </button>

      {/* Sidebar navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onExport={handleExportCSV}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        avatarUrl={userAvatar}
      />

      {/* Main content */}
      <main className="main-content">
        <header className="page-header">
          <h1>Budget Tracker</h1>
        </header>

        <div className="container-grid">
          {/* Metrics cards */}
          <section className="dashboard-section">
            <div className="metrics">
              <div className="card">
                <h3>Balance</h3>
                <p className="balance-amount">
                  ${(totalIncome - totalExpense).toFixed(2)}
                </p>
              </div>
              <div className="card">
                <h3>Income</h3>
                <p className="income-amount">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="card">
                <h3>Expenses</h3>
                <p className="expenses-amount">${totalExpense.toFixed(2)}</p>
              </div>
            </div>

            <div className="chart-section">
              <div className="card">
                <h3>30-Day Balance Trend</h3>
                <BalanceTrend data={dailyBalances} height={250} />
              </div>
            </div>
          </section>

          {/* Transactions section */}
          <section className="transactions-section">
            <div className="card form-card">
              <h3>Add Transaction</h3>
              <TransactionForm onAdd={handleAddTransaction} />
            </div>
            <div className="card list-card">
              <h3>Transactions</h3>
              <ul className="transactions">
                {filteredTransactions.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    tx={tx}
                    onDelete={handleDeleteTransaction}
                  />
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
