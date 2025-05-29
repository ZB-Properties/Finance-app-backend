
import { API_BASE_URL } from './config.js';
import { authHeaders } from './utils.js';

const form = document.getElementById('transactionForm');
const list = document.getElementById('transactionsList');


const fetchTransactions = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      headers: authHeaders()
    });

    const data = await res.json();
    list.innerHTML = '';

    data.forEach(tx => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${tx.type.toUpperCase()}</strong> - ${tx.category} - $${tx.amount} - ${new Date(tx.date).toLocaleDateString()}
        <br />
        <small>${tx.description || ''}</small>
        <br />
        <button onclick="deleteTransaction('${tx.id}')">Delete</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    alert('');
  }
};

window.deleteTransaction = async (id) => {
  if (!confirm('Delete this transaction?')) return;

  try {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    if (res.ok) {
      fetchTransactions();
    } else {
      alert('Delete failed');
    }
  } catch (err) {
    alert('Error deleting transaction');
  }
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value.trim();
  const date = document.getElementById('date').value;

  try {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ type, category, amount, description, date })
    });

    if (res.ok) {
      form.reset();
      fetchTransactions();
    } else {
      const err = await res.json();
      alert(err.error || 'Add failed');
    }
  } catch (err) {
    alert('Error adding transaction');
  }
});

fetchTransactions();
