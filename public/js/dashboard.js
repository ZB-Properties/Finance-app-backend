import { getToken, authHeaders } from './utils.js';

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expensesEl = document.getElementById('expenses');
const logoutBtn = document.getElementById('logout');

const fetchSummary = async () => {
  try {
    const res = await fetch('http://localhost:2600/api/analytics/summary', {
      headers: authHeaders()
    });

    if (!res.ok) throw new Error('Failed to fetch summary');

    const { balance, income, expenses } = await res.json();
    balanceEl.textContent = `$${balance}`;
    incomeEl.textContent = `$${income}`;
    expensesEl.textContent = `$${expenses}`;
  } catch (err) {
    alert('Session expired or error fetching data');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
};

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
});

fetchSummary();
