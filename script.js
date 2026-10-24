const initialExpenses = [
    { name: 'Groceries', category: 'Food', date: '2026-10-18', amount: 2400, status: 'Paid' },
    { name: 'Fuel', category: 'Transport', date: '2026-10-15', amount: 1500, status: 'Reviewed' },
    { name: 'Netflix', category: 'Other', date: '2026-10-12', amount: 900, status: 'Paid' }
];

const incomeTotal = 60000;
const monthlyLimit = 75000;
let expenses = [...initialExpenses];

const formatKSh = (value) => `KSh ${Number(value).toLocaleString()}`;

const currentDateEl = document.getElementById('current-date');
const tbody = document.getElementById('expense-table-body');
const form = document.getElementById('expense-form');

function renderDate() {
    if (!currentDateEl) return;
    const options = { month: 'long', year: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
}

function renderTable() {
    if (!tbody) return;

    tbody.innerHTML = expenses.map((item) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.date}</td>
            <td class="amount expense">${formatKSh(item.amount)}</td>
            <td><span class="pill ${item.status === 'Reviewed' ? 'reviewed' : 'paid'}">${item.status}</span></td>
        </tr>
    `).join('');
}

function updateSummary() {
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const balance = incomeTotal - totalExpenses;

    const balanceEl = document.getElementById('balance-amount');
    const incomeEl = document.getElementById('income-amount');
    const expenseEl = document.getElementById('expense-amount');
    const limitProgress = document.getElementById('limit-progress');
    const limitRemaining = document.getElementById('limit-remaining');

    if (balanceEl) balanceEl.textContent = formatKSh(balance);
    if (incomeEl) incomeEl.textContent = formatKSh(incomeTotal);
    if (expenseEl) expenseEl.textContent = formatKSh(totalExpenses);

    const percentage = Math.min((totalExpenses / monthlyLimit) * 100, 100);
    if (limitProgress) {
        limitProgress.style.width = `${percentage}%`;
    }

    if (limitRemaining) {
        const remaining = monthlyLimit - totalExpenses;
        limitRemaining.textContent = `${formatKSh(remaining)} left`;
    }
}

function addExpense(event) {
    event.preventDefault();
    if (!form) return;

    const name = document.getElementById('expense-name').value.trim();
    const amount = Number(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('expense-date').value;

    if (!name || !amount || !category || !date) {
        return;
    }

    expenses.unshift({
        name,
        category,
        date,
        amount,
        status: 'Paid'
    });

    renderTable();
    updateSummary();
    form.reset();
}

renderDate();
renderTable();
updateSummary();

if (form) {
    form.addEventListener('submit', addExpense);
}
