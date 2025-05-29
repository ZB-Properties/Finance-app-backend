import { API_BASE_URL } from './config.js';
import { authHeaders } from './utils.js';


const summary = document.getElementById('summary');
const pieCanvas = document.getElementById('pieChart');
const barCanvas = document.getElementById('barChart');

async function fetchAnalytics () {
  try {
    const res = await fetch(`${API_BASE_URL}/analytics/summary`, {
      method: 'GET',
      headers: authHeaders(),
    });
    const data = await res.json();

    summary.textContent = `Total Income: $${data?.income ?? 0} | Total Expense: $${data?.expenses ?? 0}`;

if (data?.categoryTotals && Object.keys(data.categoryTotals).length > 0) {
  renderPieChart(data.categoryTotals);
}

if (data?.budgets && data.budgets.length > 0) {
  renderBarChart(data.budgets);
} 

}catch (err) {
    console.error('Error in fetchAnalytics():', err);
  }
}

const renderPieChart = (categoryTotals) => {
  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  new Chart(pieCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Spending by Category',
        data: values,
        backgroundColor: generateColors(values.length),
      }]
    }
  });
};

const renderBarChart = (budgets) => {
  const labels = budgets.map(b => b.category);
  const spent = budgets.map(b => b.spent);
  const limits = budgets.map(b => b.amount);

  new Chart(barCanvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Spent',
          data: spent,
          backgroundColor: '#f44336'
        },
        {
          label: 'Budget Limit',
          data: limits,
          backgroundColor: '#4caf50'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
};

const generateColors = (count) => {
  const palette = ['#2c7be5', '#00c9a7', '#ffb400', '#e14eca', '#ff6b6b', '#1abc9c'];
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
};

fetchAnalytics();
