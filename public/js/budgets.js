
import { API_BASE_URL } from './config.js';
import { authHeaders } from './utils.js';

const form = document.getElementById('budgetForm');
const list = document.getElementById('budgetsList');


const fetchBudgets = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
      headers: authHeaders()
    });

    const budgets = await res.json();
    list.innerHTML = '';


    budgets.forEach(budget => {
      const spent = budget.spent || 0;
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${budget.category}</strong> — Limit: $${budget.amount} — Spent: $${spent}
        <br />
        <progress value="${spent}" max="${budget.amount}"></progress>
        <br />
        <button onclick="deleteBudget('${budget.id}')">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    alert('');
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const category = document.getElementById('category').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  

  try {
    const res = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ category, amount })
    });

    if (res.ok) {
      form.reset();
      fetchBudgets();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to create budget');
    }
  } catch (err) {
    alert('');
  }
});

window.deleteBudget = async (id) => {
  if (!confirm('Delete this budget?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    if (res.ok) {
      fetchBudgets();
    } else {
      alert('Delete failed');
    }
  } catch (err) {
    alert('Error deleting budget');
  }
};

fetchBudgets();
