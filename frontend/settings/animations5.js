// API
const API_BASE_URL = "https://budgetab-ai-backend.onrender.com/";

async function fetchTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}tracker/entries/`, {
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

let transactions = [
  // { id: 1, title: 'Salary', amount: 3500, date: '2025-04-15', category: 'income', notes: 'Monthly salary', entry_type: 'income' },
  // { id: 2, title: 'Rent', amount: 1200, date: '2025-04-05', category: 'bills', notes: 'Monthly rent payment', entry_type: 'expense' },
  // { id: 3, title: 'Grocery Shopping', amount: 150.75, date: '2025-04-10', category: 'food', notes: 'Weekly groceries', entry_type: 'expense' },
  // { id: 4, title: 'Freelance Project', amount: 850, date: '2025-04-12', category: 'income', notes: 'Website development for client', entry_type: 'income' },
  // { id: 5, title: 'Dinner Out', amount: 85.50, date: '2025-04-14', category: 'food', notes: 'Dinner with friends', entry_type: 'expense' },
  // { id: 6, title: 'Uber Rides', amount: 32.25, date: '2025-04-13', category: 'travel', notes: 'Transportation for the week', entry_type: 'expense' },
  // { id: 7, title: 'Internet Bill', amount: 59.99, date: '2025-04-08', category: 'bills', notes: 'Monthly internet subscription', entry_type: 'expense' }
];

// Budget Limit Warnings
async function calculateBudgetLimit() {
  // Calculate the budget limit as the sum of all income transactions
  const budgetLimit = transactions
    .filter(t => t.entry_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return budgetLimit;
}

async function calculateTotalExpenses() {
  // Calculate the total expenses
  const totalExpenses = transactions
    .filter(t => t.entry_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return totalExpenses;
}

async function checkBudget() {
  const weeklyLimit = parseFloat(document.getElementById('weekly-slider').value);
  const monthlyLimit = parseFloat(document.getElementById('monthly-slider').value);
  const annualLimit = parseFloat(document.getElementById('annually-slider').value);

  // Get the current date
  const currentDate = new Date();

  // Filter transactions by their date and calculate totals
  const weeklyExpenses = transactions
    .filter(t => t.entry_type === 'expense' && isWithinLastDays(t.date, 7, currentDate))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.entry_type === 'expense' && isWithinLastDays(t.date, 30, currentDate))
    .reduce((sum, t) => sum + t.amount, 0);

  const annualExpenses = transactions
    .filter(t => t.entry_type === 'expense' && isWithinLastDays(t.date, 365, currentDate))
    .reduce((sum, t) => sum + t.amount, 0);

  // Check if any limits are exceeded and alert accordingly
  if (weeklyExpenses > weeklyLimit) {
    alert(`Warning: Your weekly expenses ($${weeklyExpenses.toFixed(2)}) exceed your weekly limit of $${weeklyLimit.toFixed(2)}!`);
  }

  if (monthlyExpenses > monthlyLimit) {
    alert(`Warning: Your monthly expenses ($${monthlyExpenses.toFixed(2)}) exceed your monthly limit of $${monthlyLimit.toFixed(2)}!`);
  }

  if (annualExpenses > annualLimit) {
    alert(`Warning: Your annual expenses ($${annualExpenses.toFixed(2)}) exceed your annual limit of $${annualLimit.toFixed(2)}!`);
  }
}

async function updateBudgetUI() {
  const budgetLimit = await calculateBudgetLimit();
  const totalExpenses = await calculateTotalExpenses();

  document.getElementById('budget-limit').textContent = `$${budgetLimit.toFixed(2)}`;
  document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
}

async function fetchBudgetLimits() {
  try {
    const response = await fetch(`${API_BASE_URL}tracker/budget/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('weekly-slider').value = data.weekly_limit;
      document.getElementById('monthly-slider').value = data.monthly_limit;
      document.getElementById('annually-slider').value = data.annual_limit;

      document.getElementById('weekly-value').textContent = data.weekly_limit;
      document.getElementById('monthly-value').textContent = data.monthly_limit;
      document.getElementById('annually-value').textContent = data.annual_limit;
    } else {
      console.error('Failed to fetch budget limits');
    }
  } catch (error) {
    console.error('Error fetching budget limits:', error);
  }
}

// Helper function to check if a transaction is within the last X days
function isWithinLastDays(transactionDate, days, currentDate) {
  const transactionDateObj = new Date(transactionDate);
  const differenceInTime = currentDate - transactionDateObj;
  const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);
  return differenceInDays <= days;
}

// Animation-related functions and variables
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


// Sliders
function initSliders() {
  const sliders = [
    { id: 'weekly-slider', valueId: 'weekly-value', key: 'weekly_limit' },
    { id: 'monthly-slider', valueId: 'monthly-value', key: 'monthly_limit' },
    { id: 'annually-slider', valueId: 'annually-value', key: 'annual_limit' }
  ];

  sliders.forEach(({ id, valueId, key }) => {
    const slider = document.getElementById(id);
    const value = document.getElementById(valueId);

    if (slider && value) {
      // Load initial value into the UI
      value.textContent = slider.value;

      slider.addEventListener('input', async () => {
        value.textContent = slider.value;

        // Properly format the payload for the backend
        const payload = { [key]: parseFloat(slider.value) };

        try {
          const response = await fetch(`${API_BASE_URL}tracker/budget/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload), // Properly format the payload
          });

          if (!response.ok) {
            console.error('Failed to save budget limit');
          } else {
            console.log(`Successfully updated ${key} to ${slider.value}`);
          }
        } catch (error) {
          console.error('Error saving budget limit:', error);
        }
      });
    }
  });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display account information
  await fetchAccountInfo();
  
  transactions = await fetchTransactions();

  // Fetch budget limits from the backend
  await fetchBudgetLimits();

  // Check if the budget is exceeded
  await checkBudget();
  await updateBudgetUI(); // Update the budget and expenses in the UI

  extractCSSVariables();
  
  // Initialize variables
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  const menuToggle = document.getElementById('menu-toggle');
  const themeSwitch = document.getElementById('theme-switch');

  initSliders();

  // Logout API Logic
  const logoutButton = document.getElementById('logout-button');
  const logoutModal = document.getElementById('logout-modal');
  const confirmLogoutButton = document.getElementById('confirm-logout');
  const cancelLogoutButton = document.getElementById('cancel-logout');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      // Show the logout confirmation modal
      logoutModal.classList.add('visible');
    });

    cancelLogoutButton.addEventListener('click', () => {
      // Hide the modal when cancel is clicked
      logoutModal.classList.remove('visible');
    });

    confirmLogoutButton.addEventListener('click', async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token'); // Retrieve the refresh token

        if (!refreshToken) {
          // Clear all tokens and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          alert('Session expired. Please log in again.');
          window.location.href = '../login/login.html';
          return;
        }

        const response = await fetch(`${API_BASE_URL}accounts/logout/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }), // Include the refresh token in the body
        });

        if (response.ok) {
          // Clear tokens from localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');

          // Hide the modal
          logoutModal.classList.remove('visible');

          // Show a success alert
          alert('Logged out successfully.');

          // Redirect to the login page
          window.location.href = '../login/login.html';
        } else {
          console.error('Failed to log out');
          alert('Failed to log out. Please try again.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred while logging out. Please try again.');
      }
    });
  }
  
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
  
  // Toggle theme
  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    
    // Save theme preference to localStorage
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-theme', isDarkTheme);
  }
  
  // Initialize animation observers
  function initObservers() {
    // Animate cards when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
      observer.observe(card);
      
      // Add animation class for CSS
      card.classList.add('animation-ready');
    });
  }
  
  // Add bounce animation for cards
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
    // Initialize features
    renderTransactions();
    initObservers();
    
    
    // For mobile view - remove auto-collapse
    if (window.innerWidth <= 1024) {
      mainContent.classList.add('expanded');
    }
    
    window.addEventListener('resize', function() {
      if (window.innerWidth <= 1024) {
        mainContent.classList.add('expanded');
      } else {
        mainContent.classList.remove('expanded');
        sidebar.classList.remove('collapsed');
      }
    });
  }
  
  init();
});