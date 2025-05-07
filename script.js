// ==========================================
// script.js — Budget Tracker
// ==========================================

// ----- Element References -----
// Grab all the DOM nodes we interact with
const balanceEl       = document.getElementById('balance');
const incomeEl        = document.getElementById('income');
const expensesEl      = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form            = document.getElementById('transaction-form');
const descInput       = document.getElementById('description');
const amtInput        = document.getElementById('amount');
const typeInput       = document.getElementById('type');
const catInput        = document.getElementById('category');
const formErrorEl     = document.getElementById('form-error');
const themeToggle     = document.getElementById('theme-toggle');
const filterCategory  = document.getElementById('filter-category');
const budgetForm      = document.getElementById('budget-form');
const budgetInput     = document.getElementById('budget-input');
const budgetSummary   = document.getElementById('budget-summary');
const budgetBar       = document.getElementById('budget-bar');

// ----- Application State Initialization -----
// Load transactions safely from localStorage, or start fresh
let transactions;
try {
  transactions = JSON.parse(localStorage.getItem('transactions')) || [];
} catch {
  transactions = [];
  localStorage.removeItem('transactions');
}

// Chart.js instance and stored monthly budget
let chartInstance  = null;
let monthlyBudget  = parseFloat(localStorage.getItem('monthlyBudget')) || null;

// ----- Initial UI Setup -----
// Apply saved theme and render UI on page load
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
  }
  updateUI();
});

// ----- Theme Toggle Handler -----
// Persist light/dark mode choice
themeToggle.addEventListener('change', () => {
  const dark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

// ----- Utility Functions -----

// Convert ISO date ("YYYY-MM-DD") to "M/D/YY"
function formatDate(iso) {
  const [y,m,d] = iso.split('-');
  return `${parseInt(m)}/${parseInt(d)}/${y.slice(-2)}`;
}

// Sum absolute values of negative amounts
function getTotalExpenses(list) {
  return list
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

// ----- Budget Goal Logic -----
// Update the budget-summary text & progress bar
function updateBudgetStatus(list = transactions) {
  if (!monthlyBudget || monthlyBudget <= 0) {
    budgetSummary.textContent = "No budget set yet.";
    budgetBar.style.width = '0%';
    return;
  }
  const spent = getTotalExpenses(list);
  const pct   = Math.min((spent / monthlyBudget) * 100, 100);
  budgetSummary.textContent =
    `$${spent.toFixed(2)} of $${monthlyBudget.toFixed(2)} spent (${pct.toFixed(0)}%)`;
  budgetBar.style.width = `${pct}%`;
}

// Handle budget-form submission
budgetForm?.addEventListener('submit', e => {
  e.preventDefault();
  const val = parseFloat(budgetInput.value);
  if (val > 0) {
    monthlyBudget = val;
    localStorage.setItem('monthlyBudget', val);
    updateBudgetStatus(getFilteredTransactions());
    budgetInput.value = '';
  }
});

// ----- Totals & Chart Rendering -----
// Compute balance/income/expense & redraw the doughnut chart
function updateTotals(list) {
  const amts    = list.map(t => t.amount);
  const income  = amts.filter(v => v > 0).reduce((a,b) => a + b, 0);
  const expense = amts.filter(v => v < 0).reduce((a,b) => a + b, 0);

  balanceEl.textContent  = (income + expense).toFixed(2);
  incomeEl.textContent   = income.toFixed(2);
  expensesEl.textContent = Math.abs(expense).toFixed(2);
  renderChart(income, expense);
}

// ----- Transaction List Rendering -----
// Build each <li> safely (no innerHTML)
function addTransactionToDOM(tx) {
  const li = document.createElement('li');
  li.classList.add(tx.amount < 0 ? 'expense' : 'income');
  li.dataset.id = tx.id;

  const desc = Object.assign(document.createElement('span'), {
    className: 'desc', textContent: tx.description
  });
  const amt = Object.assign(document.createElement('span'), {
    className: 'amount',
    textContent: `${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}`
  });
  const cat = Object.assign(document.createElement('span'), {
    className: 'category-badge', textContent: tx.category
  });
  const date = Object.assign(document.createElement('span'), {
    className: 'date', textContent: formatDate(tx.date)
  });

  const actions = document.createElement('div');
  actions.className = 'actions';
  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  delBtn.addEventListener('click', () => deleteTransaction(tx.id));
  actions.appendChild(delBtn);

  li.append(desc, amt, cat, date, actions);
  transactionList.appendChild(li);
}

// ----- UI Update -----
function updateUI() {
  transactionList.innerHTML = '';
  const filtered = getFilteredTransactions();
  filtered.forEach(addTransactionToDOM);
  updateTotals(filtered);
  updateBudgetStatus(filtered);
}

// ----- Filtering -----
function getFilteredTransactions() {
  const cat = filterCategory?.value || 'all';
  return transactions.filter(t => cat === 'all' || t.category === cat);
}
filterCategory?.addEventListener('change', updateUI);

// ----- Form Validation Helpers -----
function showError(msg) {
  formErrorEl.textContent    = msg;
  formErrorEl.style.display  = 'block';
}
function clearError() {
  formErrorEl.style.display  = 'none';
}

// ----- Add Transaction Handler -----
form.addEventListener('submit', e => {
  e.preventDefault();
  clearError();

  const descVal = descInput.value.trim();
  const amtVal  = parseFloat(amtInput.value.trim());
  const catVal  = catInput.value;

  if (!descVal)                    return showError('Description is required.');
  if (isNaN(amtVal) || amtVal <= 0) return showError('Enter a positive amount.');
  if (!catVal)                     return showError('Select a category.');

  const signed = typeInput.value === 'expense'
    ? -Math.abs(amtVal)
    : Math.abs(amtVal);

  const date = new Date().toLocaleDateString('en-CA');
  transactions.push({
    id: Date.now(),
    description: descVal,
    amount: signed,
    category: catVal,
    date
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
  form.reset();
  typeInput.value = 'income';
});

// ----- Delete Transaction -----
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

// ----- Chart Rendering -----
function renderChart(income, expense) {
  const ctx = document.getElementById('budgetChart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income','Expenses'],
      datasets: [{
        data: [income, Math.abs(expense)],
        backgroundColor: ['#2ecc71','#e74c3c'],
        borderWidth: 1
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}

// ----- CSV Export Handler -----
document.getElementById('export-btn')?.addEventListener('click', () => {
  if (!transactions.length) {
    return alert("No transactions to export.");
  }
  const headers = ["Description","Amount","Type","Category","Date"];
  const rows = transactions.map(t => [
    `"${t.description}"`,
    t.amount,
    t.amount < 0 ? "Expense" : "Income",
    t.category,
    formatDate(t.date)
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'transactions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});