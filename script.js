const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const themeToggle = document.getElementById('theme-toggle');

const filterCategory = document.getElementById('filter-category');
const filterDate = document.getElementById('filter-date');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chartInstance = null;

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.checked = true;
  }
  updateUI();
});

function updateTotals(filtered) {
  const amounts = filtered.map(t => t.amount);
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
  item.setAttribute('data-id', transaction.id);
  item.innerHTML = `
    <span class="desc">${transaction.description}</span>
    <span class="amount">${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    <div class="actions">
      <button class="edit-btn" onclick="editTransaction(${transaction.id})"><i class="fas fa-edit"></i></button>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})"><i class="fas fa-trash-alt"></i></button>
    </div>
  `;
  transactionList.appendChild(item);
}

function updateUI() {
  transactionList.innerHTML = '';
  const filtered = getFilteredTransactions();
  filtered.forEach(addTransactionToDOM);
  updateTotals(filtered);
}

function getFilteredTransactions() {
  const cat = filterCategory.value;
  const date = filterDate.value;
  return transactions.filter(t => {
    const matchesCategory = cat === "all" || t.category === cat;
    const matchesDate = !date || t.date === date;
    return matchesCategory && matchesDate;
  });
}

function addTransaction(e) {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const type = typeInput.value;
  const category = categoryInput.value;

  if (!description || isNaN(amount) || amount <= 0 || !category) return;

  const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);
  const date = new Date().toLocaleDateString('en-CA'); // e.g., 2025-04-29

  const newTransaction = {
    id: Date.now(),
    description,
    amount: signedAmount,
    category,
    date
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();

  form.reset();
  typeInput.value = 'income';
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  const item = document.querySelector(`[data-id='${id}']`);

  item.innerHTML = `
    <input type="text" class="edit-desc" value="${transaction.description}" />
    <select class="edit-type">
      <option value="income" ${transaction.amount > 0 ? 'selected' : ''}>Income</option>
      <option value="expense" ${transaction.amount < 0 ? 'selected' : ''}>Expense</option>
    </select>
    <input type="number" class="edit-amount" value="${Math.abs(transaction.amount)}" />
    <select class="edit-category">
      <option value="salary" ${transaction.category === "salary" ? "selected" : ""}>Salary</option>
      <option value="food" ${transaction.category === "food" ? "selected" : ""}>Food</option>
      <option value="rent" ${transaction.category === "rent" ? "selected" : ""}>Rent</option>
      <option value="entertainment" ${transaction.category === "entertainment" ? "selected" : ""}>Entertainment</option>
      <option value="misc" ${transaction.category === "misc" ? "selected" : ""}>Misc</option>
    </select>
    <input type="date" class="edit-date" value="${transaction.date}" />
    <div class="actions">
      <button onclick="saveTransaction(${id})"><i class="fas fa-check"></i></button>
      <button onclick="cancelEdit(${id})"><i class="fas fa-times"></i></button>
    </div>
  `;
}

function saveTransaction(id) {
  const item = document.querySelector(`[data-id='${id}']`);
  const desc = item.querySelector('.edit-desc').value.trim();
  const amount = parseFloat(item.querySelector('.edit-amount').value);
  const type = item.querySelector('.edit-type').value;
  const category = item.querySelector('.edit-category').value;
  const date = item.querySelector('.edit-date').value;

  if (!desc || isNaN(amount) || amount <= 0 || !category || !date) return;

  const index = transactions.findIndex(t => t.id === id);
  const signedAmount = type === "expense" ? -Math.abs(amount) : Math.abs(amount);

  transactions[index] = {
    ...transactions[index],
    description: desc,
    amount: signedAmount,
    category,
    date
  };

  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();
}

function cancelEdit(id) {
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

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

form.addEventListener('submit', addTransaction);
filterCategory.addEventListener('change', updateUI);
filterDate.addEventListener('change', updateUI);