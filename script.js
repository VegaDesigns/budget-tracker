const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const themeToggle = document.getElementById('theme-toggle');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chartInstance = null;

// 🌓 Apply saved theme on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
  }
});

function updateTotals() {
  const amounts = transactions.map(t => t.amount);
  const income = amounts.filter(v => v > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter(v => v < 0).reduce((a, b) => a + b, 0);
  const balance = income + expense;

  balanceEl.textContent = balance.toFixed(2);
  incomeEl.textContent = income.toFixed(2);
  expensesEl.textContent = Math.abs(expense).toFixed(2);

  renderChart(income, expense);
}

function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.innerHTML = `
    ${transaction.description}
    <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
      <i class="fas fa-trash-alt"></i>
    </button>
  `;
  transactionList.appendChild(item);
}

function updateUI() {
  transactionList.innerHTML = '';
  transactions.forEach(addTransactionToDOM);
  updateTotals();
}

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = typeInput.value;

  if (!description || isNaN(amount) || amount <= 0) return;

  const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

  const newTransaction = {
    id: Date.now(),
    description,
    amount: signedAmount
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();

  // Reset form
  descriptionInput.value = '';
  amountInput.value = '';
  typeInput.value = 'income';
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

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
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// 🌗 Toggle and persist dark mode
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

form.addEventListener('submit', addTransaction);
updateUI();