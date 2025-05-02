// DOM Elements & Constants
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const themeToggle = document.getElementById('theme-toggle');
const filterCategory = document.getElementById('filter-category');

const budgetForm = document.getElementById('budget-form');
const budgetInput = document.getElementById('budget-input');
const budgetSummary = document.getElementById('budget-summary');
const budgetBar = document.getElementById('budget-bar');

// Application State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chartInstance = null;
let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || null;

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
  }
  updateUI();
});

// Theme Toggle
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Utility: Date Formatting
function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${parseInt(month)}/${parseInt(day)}/${year.slice(-2)}`;
}

// Budget Goal Functions
function getTotalExpenses() {
  return transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function updateBudgetStatus() {
  if (!monthlyBudget || monthlyBudget <= 0) {
    budgetSummary.textContent = "No budget set yet.";
    budgetBar.style.width = '0%';
    return;
  }
  const spent = getTotalExpenses();
  const percent = Math.min((spent / monthlyBudget) * 100, 100);
  budgetSummary.textContent = `$${spent.toFixed(2)} of $${monthlyBudget.toFixed(2)} spent (${percent.toFixed(0)}%)`;
  budgetBar.style.width = `${percent}%`;
}

budgetForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = parseFloat(budgetInput.value);
  if (!value || value <= 0) return;
  monthlyBudget = value;
  localStorage.setItem('monthlyBudget', value);
  updateBudgetStatus();
  budgetInput.value = '';
});

// Totals and Chart Update
function updateTotals(filtered) {
  const amounts = filtered.map(t => t.amount);
  const income = amounts.filter(v => v > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter(v => v < 0).reduce((a, b) => a + b, 0);

  balanceEl.textContent = (income + expense).toFixed(2);
  incomeEl.textContent = income.toFixed(2);
  expensesEl.textContent = Math.abs(expense).toFixed(2);

  renderChart(income, expense);
}

// Transaction Rendering
function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const formattedDate = formatDate(transaction.date);

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.setAttribute('data-id', transaction.id);
  item.innerHTML = `
    <span class="desc">${transaction.description}</span>
    <span class="amount">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    <span class="category-badge">${transaction.category}</span>
    <span class="date">${formattedDate}</span>
    <div class="actions">
      <button onclick="editTransaction(${transaction.id})"><i class="fas fa-edit"></i></button>
      <button onclick="deleteTransaction(${transaction.id})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;
  transactionList.appendChild(item);
}

// UI Refresh
function updateUI() {
  transactionList.innerHTML = '';
  const filtered = getFilteredTransactions();
  filtered.forEach(addTransactionToDOM);
  updateTotals(filtered);
  updateBudgetStatus();
}

// Filtering
function getFilteredTransactions() {
  const cat = filterCategory?.value || "all";
  return transactions.filter(t => cat === "all" || t.category === cat);
}

// Add Transaction Logic
function addTransaction(e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = typeInput.value;
  const category = categoryInput.value;

  if (!description || isNaN(amount) || amount <= 0 || !category) return;

  const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);
  const date = new Date().toLocaleDateString('en-CA');

  transactions.push({ id: Date.now(), description, amount: signedAmount, category, date });
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();

  form.reset();
  typeInput.value = 'income';
}

// Delete Transaction
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

// Inline Edit Transaction
function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  const item = document.querySelector(`[data-id='${id}']`);

  item.innerHTML = `
    <div class="edit-group">
      <input type="text" class="edit-desc styled-input" value="${transaction.description}" />
      <select class="edit-type styled-select">
        <option value="income" ${transaction.amount > 0 ? 'selected' : ''}>Income</option>
        <option value="expense" ${transaction.amount < 0 ? 'selected' : ''}>Expense</option>
      </select>
      <input type="number" class="edit-amount styled-input" value="${Math.abs(transaction.amount)}" />
      <select class="edit-category styled-select">
        <option value="salary" ${transaction.category === "salary" ? "selected" : ""}>Salary</option>
        <option value="food" ${transaction.category === "food" ? "selected" : ""}>Food</option>
        <option value="rent" ${transaction.category === "rent" ? "selected" : ""}>Rent</option>
        <option value="entertainment" ${transaction.category === "entertainment" ? "selected" : ""}>Entertainment</option>
        <option value="misc" ${transaction.category === "misc" ? "selected" : ""}>Misc</option>
      </select>
      <div class="actions">
        <button onclick="saveTransaction(${id})"><i class="fas fa-check"></i></button>
        <button onclick="cancelEdit(${id})"><i class="fas fa-times"></i></button>
      </div>
    </div>
  `;
}

// Save Edited Transaction
function saveTransaction(id) {
  const item = document.querySelector(`[data-id='${id}']`);
  const desc = item.querySelector('.edit-desc').value.trim();
  const amount = parseFloat(item.querySelector('.edit-amount').value);
  const type = item.querySelector('.edit-type').value;
  const category = item.querySelector('.edit-category').value;

  if (!desc || isNaN(amount) || amount <= 0 || !category) return;

  const index = transactions.findIndex(t => t.id === id);
  transactions[index] = {
    ...transactions[index],
    description: desc,
    amount: type === "expense" ? -Math.abs(amount) : Math.abs(amount),
    category,
    date: new Date().toLocaleDateString('en-CA')
  };

  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

// Cancel Edit
function cancelEdit() {
  updateUI();
}

// Render Chart.js Doughnut
function renderChart(income, expenses) {
  const ctx = document.getElementById('budgetChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expenses'],
      datasets: [{
        data: [income, Math.abs(expenses)],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        borderWidth: 1
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

// Event Listeners
form.addEventListener('submit', addTransaction);
filterCategory?.addEventListener('change', updateUI);

// Export to CSV
document.getElementById('export-btn')?.addEventListener('click', () => {
  if (!transactions.length) {
    alert("No transactions to export.");
    return;
  }

  const headers = ["Description", "Amount", "Type", "Category", "Date"];
  const rows = transactions.map(t => [
    `"${t.description}"`,
    t.amount,
    t.amount < 0 ? "Expense" : "Income",
    t.category,
    formatDate(t.date)
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});