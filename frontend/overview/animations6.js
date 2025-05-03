// API
async function fetchTransactions() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/tracker/entries/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.map(transaction => ({
        ...transaction,
        amount: parseFloat(transaction.amount) || 0, // Ensure `amount` is a number
      }));
    } else {
      console.error('Failed to fetch transactions');
      return [];
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

async function fetchAccountInfo() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/accounts/me/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    if (response.ok) {
      const accountData = await response.json();

      // Update the user info in the sidebar
      const userNameElement = document.querySelector('.user-name');
      const userEmailElement = document.querySelector('.user-email');
      const userAvatarElement = document.querySelector('.user-info img');

      if (userNameElement) userNameElement.textContent = accountData.name || 'Unknown';
      if (userEmailElement) userEmailElement.textContent = accountData.email || 'Unknown email';
      if (userAvatarElement) userAvatarElement.src = accountData.avatar || userAvatarElement.src;
    } else {
      console.error('Failed to fetch account information');
    }
  } catch (error) {
    console.error('Error fetching account information:', error);
  }
}

// === Global Variables ===
let pieChartInstance = null;
let barChartInstance = null;
const cssVariables = {};
const root = document.documentElement;
const style = getComputedStyle(root);

// === CSS Variable Extraction ===
function extractCSSVariables() {
  const properties = style.cssText.split(';');
  properties.forEach(property => {
    const match = property.match(/--([^:]+):\s*([^;]+)/);
    if (match) {
      const [, name, value] = match;
      cssVariables[`--${name.trim()}`] = value.trim();
    }
  });

  const primaryColor = hexToRgb(style.getPropertyValue('--color-primary').trim());
  if (primaryColor) {
    root.style.setProperty('--color-primary-rgb', `${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}`);
  }
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

// === Dummy Data ===
let transactions = [
  // { id: 1, title: 'Salary', amount: 3500, date: '2025-04-15', category: 'income', notes: 'Monthly salary', entry_type: 'income' },
  // { id: 2, title: 'Rent', amount: 1200, date: '2025-04-05', category: 'bills', notes: 'Monthly rent payment', entry_type: 'expense' },
  // { id: 3, title: 'Grocery Shopping', amount: 150.75, date: '2025-04-10', category: 'food', notes: 'Weekly groceries', entry_type: 'expense' },
  // { id: 4, title: 'Freelance Project', amount: 850, date: '2025-04-12', category: 'income', notes: 'Website development for client', entry_type: 'income' },
  // { id: 5, title: 'Dinner Out', amount: 85.50, date: '2025-04-14', category: 'food', notes: 'Dinner with friends', entry_type: 'expense' },
  // { id: 6, title: 'Uber Rides', amount: 32.25, date: '2025-04-13', category: 'travel', notes: 'Transportation for the week', entry_type: 'expense' },
  // { id: 7, title: 'Internet Bill', amount: 59.99, date: '2025-04-08', category: 'bills', notes: 'Monthly internet subscription', entry_type: 'expense' }
];


// === Intersection Observer ===
function initObservers() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
    card.classList.add('animation-ready');
  });
}

// === Bounce Animation ===
const cardStyle = document.createElement('style');
cardStyle.textContent = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-10px);}
    60% {transform: translateY(-5px);}
  }
  .bounce {
    animation: bounce 0.8s ease;
  }
`;
document.head.appendChild(cardStyle);



// === DOM Content Loaded ===
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display account information
  await fetchAccountInfo();
  transactions = await fetchTransactions();
  
  extractCSSVariables();

  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const menuToggle = document.getElementById('menu-toggle');
  const themeSwitch = document.getElementById('theme-switch');
  const isDark = localStorage.getItem('dark-theme') === 'true';

  // Export CSV Button
  document.getElementById('export-csv-button').addEventListener('click', async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tracker/entries/export/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to export CSV');
        alert('Failed to export CSV. Please try again.');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('An error occurred while exporting the CSV. Please try again.');
    }
  });

  // Dark Mode
  if (isDark) {
    document.body.classList.add('dark-theme');
    if (themeSwitch) themeSwitch.checked = true;
  }

  if (menuToggle) menuToggle.addEventListener('click', toggleSidebar);
  if (themeSwitch) themeSwitch.addEventListener('change', toggleTheme);

  // Toggle sidebar
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Update toggle icon
    const icon = menuToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
    
    // For mobile view
    if (window.innerWidth <= 1024) {
      sidebar.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    }
  }

  initObservers();
  initializeCharts();

    // === Theme Toggle ===
  function updateChartColors(isDarkTheme) {
    const textColor = isDarkTheme ? '#fff' : '#333';
    const gridColor = isDarkTheme ? '#555' : '#eee';

    if (pieChartInstance) {
      pieChartInstance.options.plugins.legend.labels.color = textColor;
      pieChartInstance.update();
    }

    if (barChartInstance) {
      barChartInstance.options.plugins.legend.labels.color = textColor;
      barChartInstance.options.scales.x.ticks.color = textColor;
      barChartInstance.options.scales.y.ticks.color = textColor;
      barChartInstance.options.scales.y.grid.color = gridColor;
      barChartInstance.update();
    }

    if (window.myPieChart && window.myLineChart) {
      const fontColor = textColor;
      window.myPieChart.options.plugins.legend.labels.color = fontColor;
      window.myPieChart.options.plugins.tooltip.bodyColor = fontColor;
      window.myPieChart.options.plugins.tooltip.titleColor = fontColor;

      window.myLineChart.options.scales.x.ticks.color = fontColor;
      window.myLineChart.options.scales.y.ticks.color = fontColor;
      window.myLineChart.options.plugins.legend.labels.color = fontColor;
      window.myLineChart.options.plugins.tooltip.bodyColor = fontColor;
      window.myLineChart.options.plugins.tooltip.titleColor = fontColor;

      window.myPieChart.update();
      window.myLineChart.update();
    }
  }

  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('dark-theme', isDark);
    updateChartColors(isDark);
  }

  async function initializeCharts() {
    const transactions = await fetchTransactions(); // Fetch transactions from the API
  
    // Group transactions by category for expenses
    const expenseCategories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Other'];
    const expenseData = expenseCategories.map(category => {
      return transactions
        .filter(t => t.entry_type === 'expense' && t.category.toLowerCase() === category.toLowerCase())
        .reduce((sum, t) => sum + t.amount, 0);
    });
  
    // Group transactions by month for income and expenses
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const incomeData = months.map((month, index) => {
      return transactions
        .filter(t => t.entry_type === 'income' && new Date(t.date).getMonth() === index)
        .reduce((sum, t) => sum + t.amount, 0);
    });
  
    const expenseDataByMonth = months.map((month, index) => {
      return transactions
        .filter(t => t.entry_type === 'expense' && new Date(t.date).getMonth() === index)
        .reduce((sum, t) => sum + t.amount, 0);
    });
  
    const isDark = localStorage.getItem('dark-theme') === 'true';
    const textColor = isDark ? '#fff' : '#333';
    const gridColor = isDark ? '#555' : '#eee';
  
    // === Pie Chart for Expenses by Category ===
    const ctxPie = document.getElementById('expensesPieChart')?.getContext('2d');
    if (ctxPie) {
      pieChartInstance = new Chart(ctxPie, {
        type: 'pie',
        data: {
          labels: expenseCategories,
          datasets: [{
            data: expenseData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: '#ffffff',
            borderWidth: 2,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: textColor,
                font: { size: 14, weight: 'bold' }
              }
            }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      });
    }
  
    // === Bar Chart for Income and Expenses by Month ===
    const ctxBar = document.getElementById('incomeExpenseBarChart')?.getContext('2d');
    if (ctxBar) {
      barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: '#36A2EB',
              borderRadius: 8,
              barThickness: 40
            },
            {
              label: 'Expense',
              data: expenseDataByMonth,
              backgroundColor: '#FF6384',
              borderRadius: 8,
              barThickness: 40
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                color: textColor,
                font: { weight: 'bold' }
              },
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: textColor,
                font: { weight: 'bold' }
              },
              grid: { color: gridColor }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: textColor,
                font: { size: 14, weight: 'bold' }
              }
            }
          },
          animation: {
            duration: 1500,
            easing: 'easeOutBounce'
          }
        }
      });
    }
  
    // === Expense Breakdown Table Renderer ===
    function renderBreakdownTable(chart) {
      const barChartCanvas = document.getElementById('incomeExpenseBarChart');
      const breakdownId = 'expense-breakdown-table';
  
      // Remove existing table if it exists
      const existingTable = document.getElementById(breakdownId);
      if (existingTable) existingTable.remove();
  
      // Create table
      const table = document.createElement('table');
      table.id = breakdownId;
      table.style.marginTop = '20px';
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.maxWidth = '500px';
      table.style.fontSize = '14px';
      table.style.color = textColor;
  
      // Table headers
      const headerRow = document.createElement('tr');
      ['Category', 'Amount ($)'].forEach((text) => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.borderBottom = '1px solid #ccc';
        th.style.padding = '6px';
        th.style.textAlign = 'left';
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
  
      // Table rows from pie chart data
      const { data, labels } = chart.data;
      data.datasets[0].data.forEach((value, index) => {
        const row = document.createElement('tr');
  
        const categoryCell = document.createElement('td');
        categoryCell.textContent = labels[index];
        categoryCell.style.padding = '6px';
  
        const valueCell = document.createElement('td');
        valueCell.textContent = `$${value.toFixed(2)}`;
        valueCell.style.padding = '6px';
  
        row.appendChild(categoryCell);
        row.appendChild(valueCell);
        table.appendChild(row);
      });
  
      // Insert after bar chart canvas
      barChartCanvas.parentNode.insertBefore(table, barChartCanvas.nextSibling);
    }
  
    // Render breakdown table after all charts are initialized
    if (pieChartInstance && barChartInstance) {
      renderBreakdownTable(pieChartInstance);
    }
  }


  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.body.classList.add("reduce-motion");
  }
});




