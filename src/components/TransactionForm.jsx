import React, { useState } from "react";

// Renders the form for adding a transaction and handles validation
export default function TransactionForm({ onAdd }) {
  // Form state
  const [description, setDescription] = useState("");
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("salary");
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate description
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    // Validate amount
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      setError("Enter a valid positive amount.");
      return;
    }

    // Build transaction object
    const signed = type === "expense" ? -Math.abs(value) : Math.abs(value);
    const tx = {
      id: Date.now(),
      description: description.trim(),
      amount: signed,
      category,
      date: Date.now(),
    };

    // Pass new transaction up and reset form
    onAdd(tx);
    setDescription("");
    setType("income");
    setAmount("");
    setCategory("salary");
  };

  return (
    <form id="transaction-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}

      {/* Description input */}
      <label htmlFor="description">Description</label>
      <input
        id="description"
        type="text"
        value={description}
        placeholder="e.g., Salary or Groceries"
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Income or Expense */}
      <label htmlFor="type">Type</label>
      <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Amount input */}
      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        type="number"
        value={amount}
        placeholder="e.g., 500"
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Category selector */}
      <label htmlFor="category">Category</label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="salary">Salary</option>
        <option value="food">Food</option>
        <option value="rent">Rent</option>
        <option value="entertainment">Entertainment</option>
        <option value="misc">Misc</option>
      </select>

      {/* Submit button */}
      <button type="submit" className="budget-btn">
        Add Transaction
      </button>
    </form>
  );
}
