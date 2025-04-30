const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateTotals() {
  const amounts = transactions.map(t => t.amount);
  const income = amounts.filter(v => v > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter(v => v < 0).reduce((a, b) => a + b, 0);
  const balance = income + expense;

  balanceEl.textContent = balance.toFixed(2);
  incomeEl.textContent = income.toFixed(2);
  expensesEl.textContent = Math.abs(expense).toFixed(2);
}

function addTransactionToDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
  item.innerHTML = \`\${transaction.description} <span>\${sign}$\${Math.abs(transaction.amount).toFixed(2)}</span>\`;
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

  if (!description || isNaN(amount)) return;

  const newTransaction = {
    id: Date.now(),
    description,
    amount
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateUI();

  descriptionInput.value = '';
  amountInput.value = '';
}

form.addEventListener('submit', addTransaction);
updateUI();
