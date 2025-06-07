const API_BASE_URL = "https://budgetab-ai-backend.onrender.com/";

// Account Info API
async function fetchAccountInfo() {
  try {
    const response = await fetch(`${API_BASE_URL}accounts/me/`, {
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

// Data-related functions and variables
const cssVariables = {};
const root = document.documentElement;
const style = getComputedStyle(root);

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

let transactions = [];

function calculateFinancialSummary() {
  const incomeAmountElement = document.querySelector('.income-card .amount');
  const expenseAmountElement = document.querySelector('.expense-card .amount');
  const balanceAmountElement = document.querySelector('.balance-card .amount');

  // Edge case if we ever have an empty list
  if (transactions.length === 0) {
    // If the transactions list is empty, set all amounts to 0
    if (incomeAmountElement) {
      incomeAmountElement.textContent = `$0.00`;
    }
    if (expenseAmountElement) {
      expenseAmountElement.textContent = `$0.00`;
    }
    if (balanceAmountElement) {
      balanceAmountElement.textContent = `$0.00`;
    }
    return; // Exit the function early
  }
  
  // Secured the type-checking
  const totalIncome = transactions
    .filter(t => t.entry_type === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.entry_type === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const balance = totalIncome - totalExpenses;

  // Update UI only if elements exist
  if (incomeAmountElement) {
    incomeAmountElement.textContent = `$${totalIncome.toFixed(2)}`;
  }
  if (expenseAmountElement) {
    expenseAmountElement.textContent = `$${totalExpenses.toFixed(2)}`;
  }
  if (balanceAmountElement) {
    balanceAmountElement.textContent = `$${balance.toFixed(2)}`;
  }

  // Update trends only if elements exist
  const incomeTrend = document.querySelector('.income-card .trend');
  const expenseTrend = document.querySelector('.expense-card .trend');
  const balanceTrend = document.querySelector('.balance-card .trend');

  if (incomeTrend) {
    const incomeTrendPercent = Math.floor(Math.random() * 15) + 5;
    incomeTrend.innerHTML = `<i class="fa-solid fa-arrow-up"></i> ${incomeTrendPercent}% from last month`;
    incomeTrend.className = 'trend positive';
  }

  if (expenseTrend) {
    const expenseTrendPercent = Math.floor(Math.random() * 12) + 3;
    expenseTrend.innerHTML = `<i class="fa-solid fa-arrow-down"></i> ${expenseTrendPercent}% from last month`;
    expenseTrend.className = 'trend positive';
  }

  if (balanceTrend) {
    const balanceTrendPercent = Math.floor(Math.random() * 20) + 8;
    balanceTrend.innerHTML = `<i class="fa-solid fa-arrow-up"></i> ${balanceTrendPercent}% from last month`;
    balanceTrend.className = 'trend positive';
  }

  checkBudgetWarning();
}

function checkBudgetWarning() {
  const totalIncome = transactions
    .filter(t => t.entry_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.entry_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalExpenses > totalIncome) {
    showNotification('Warning: Expenses exceed total income!', 'error');
  }
}

// Animation-related functions
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

// Add bounce animation styles
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

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="close-notification">
      <i class="fa-solid fa-times"></i>
    </button>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('active');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);

  notification.querySelector('.close-notification').addEventListener('click', () => {
    notification.classList.remove('active');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const aiBtn = document.getElementById('ai-assistant-btn');
  const aiModal = document.getElementById('ai-modal');
  const closeBtn = document.getElementById('close-ai-modal');
  const aiSuggestions = document.getElementById('ai-suggestions');

  // Toggle modal visibility
  aiBtn.addEventListener('click', function() {
    if (aiModal.style.display === 'block') {
      aiModal.style.display = 'none';
    } else {
      aiModal.style.display = 'block';
      fetchSpendingInsights();
    }
  });

  // Close modal
  closeBtn.addEventListener('click', function() {
    aiModal.style.display = 'none';
  });

  // Close when clicking outside modal
  window.addEventListener('click', function(e) {
    if (e.target === aiModal) {
      aiModal.style.display = 'none';
    }
  });

  // Fetch spending insights from API (same as before)
  async function fetchSpendingInsights() {
    try {
      // Show loading state
      aiSuggestions.innerHTML = '<div class="ai-suggestion">Analyzing your spending patterns...</div>';
      
      // Get authentication token (assuming you're using JWT)
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}tracker/insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      
      // Format the suggestions from API response
      if (data.insights && data.insights.length > 0) {
        aiSuggestions.innerHTML = data.insights
          .map(insight => `<div class="ai-suggestion">${insight.message}</div>`)
          .join('');
      } else {
        aiSuggestions.innerHTML = '<div class="ai-suggestion">No insights available yet. Add more transactions to get suggestions.</div>';
      }
      
    } catch (error) {
      console.error('Error fetching insights:', error);
      aiSuggestions.innerHTML = `
        <div class="ai-suggestion">
          <span class="ai-loading"></span>
          Analyzing your spending patterns...
        </div>
      `;
    }
  }
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display account information
  await fetchAccountInfo();
  
  extractCSSVariables();
  
  // Initialize variables
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const menuToggle = document.getElementById('menu-toggle');
  const themeSwitch = document.getElementById('theme-switch');
  const transactionModal = document.getElementById('transaction-modal');
  const editTransactionModal = document.getElementById('edit-transaction-modal');
  const addTransactionBtn = document.getElementById('add-transaction');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const cancelTransactionBtn = document.getElementById('cancel-transaction');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const deleteTransactionBtn = document.getElementById('delete-transaction');
  const transactionForm = document.getElementById('transaction-form');
  const editTransactionForm = document.getElementById('edit-transaction-form');
  const transactionsList = document.getElementById('transactions-list');

  // Toggle sidebar with responsive behavior
  function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    // Update toggle icon
    const icon = menuToggle.querySelector('i');
    if (sidebar.classList.contains('collapsed')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-caret-square-right');
    } else {
      icon.classList.remove('fa-caret-square-right');
      icon.classList.add('fa-bars');
    }
    
    // For mobile view, keep sidebar partially visible
    if (window.innerWidth <= 1024) {
      document.body.classList.toggle('sidebar-open');
      if (!sidebar.classList.contains('collapsed')) {
        mainContent.style.marginLeft = '60px';
      } else {
        mainContent.style.marginLeft = '0';
      }
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('dark-theme', document.body.classList.contains('dark-theme'));
  }
  
  // Initialize app
  function init() {
    // Check for saved theme preference
    if (localStorage.getItem('dark-theme') === 'true') {
      document.body.classList.add('dark-theme');
      themeSwitch.checked = true;
    }
    
    // Add event listeners
    menuToggle.addEventListener('click', toggleSidebar);
    themeSwitch.addEventListener('change', toggleTheme);
    
    // For mobile view - handle responsive behavior
    if (window.innerWidth <= 1024) {
      mainContent.classList.add('expanded');
      sidebar.classList.add('collapsed');
      mainContent.style.marginLeft = '60px';
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1024) {
        mainContent.classList.add('expanded');
        if (!sidebar.classList.contains('collapsed')) {
          sidebar.classList.add('collapsed');
          mainContent.style.marginLeft = '60px';
        }
      } else {
        mainContent.style.marginLeft = '';
        mainContent.classList.remove('expanded');
        sidebar.classList.remove('collapsed');
      }
    });
    
    // Initialize features
    renderTransactions();
    initFilterDropdown();
    initObservers();
  }
  
  init();
});

// Add event listener for the "Add Entry" button
addTransactionBtn.addEventListener('click', () => {
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('transaction-date').value = today;
  
  // Show the modal
  transactionModal.style.display = 'block';
});

// Close modal handlers
closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    transactionModal.style.display = 'none';
    editTransactionModal.style.display = 'none';
  });
});

cancelTransactionBtn.addEventListener('click', () => {
  transactionModal.style.display = 'none';
});

cancelEditBtn.addEventListener('click', () => {
  editTransactionModal.style.display = 'none';
});