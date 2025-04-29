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
  { id: 1, title: 'Salary', amount: 3500, date: '2025-04-15', category: 'income', notes: 'Monthly salary', entry_type: 'income' },
  { id: 2, title: 'Rent', amount: 1200, date: '2025-04-05', category: 'bills', notes: 'Monthly rent payment', entry_type: 'expense' },
  { id: 3, title: 'Grocery Shopping', amount: 150.75, date: '2025-04-10', category: 'food', notes: 'Weekly groceries', entry_type: 'expense' },
  { id: 4, title: 'Freelance Project', amount: 850, date: '2025-04-12', category: 'income', notes: 'Website development for client', entry_type: 'income' },
  { id: 5, title: 'Dinner Out', amount: 85.50, date: '2025-04-14', category: 'food', notes: 'Dinner with friends', entry_type: 'expense' },
  { id: 6, title: 'Uber Rides', amount: 32.25, date: '2025-04-13', category: 'travel', notes: 'Transportation for the week', entry_type: 'expense' },
  { id: 7, title: 'Internet Bill', amount: 59.99, date: '2025-04-08', category: 'bills', notes: 'Monthly internet subscription', entry_type: 'expense' }
];

function calculateFinancialSummary() {
  const totalIncome = transactions
    .filter(t => t.entry_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.entry_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  incomeAmountElement.textContent = `$${totalIncome.toFixed(2)}`;
  expenseAmountElement.textContent = `$${totalExpenses.toFixed(2)}`;
  balanceAmountElement.textContent = `$${balance.toFixed(2)}`;

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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
  const dateRangeSelect = document.getElementById('date-range-select');
  
  // Financial summary elements
  const incomeAmountElement = document.querySelector('.income-card .amount');
  const expenseAmountElement = document.querySelector('.expense-card .amount');
  const balanceAmountElement = document.querySelector('.balance-card .amount');
  
  // Add warning if expenses exceed budget or total income
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

  // Call checkBudgetWarning after recalculating financial summary
  function calculateFinancialSummary() {
    const totalIncome = transactions
      .filter(t => t.entry_type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.entry_type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    // Update UI
    incomeAmountElement.textContent = `$${totalIncome.toFixed(2)}`;
    expenseAmountElement.textContent = `$${totalExpenses.toFixed(2)}`;
    balanceAmountElement.textContent = `$${balance.toFixed(2)}`;
    
    // Update trends (for demo purposes - in a real app, this would compare to previous periods)
    const incomeTrend = document.querySelector('.income-card .trend');
    const expenseTrend = document.querySelector('.expense-card .trend');
    const balanceTrend = document.querySelector('.balance-card .trend');
    
    // Calculate random trends for demonstration
    const randomTrend = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const incomeTrendPercent = randomTrend(5, 15);
    const expenseTrendPercent = randomTrend(3, 12);
    const balanceTrendPercent = randomTrend(8, 20);
    
    incomeTrend.innerHTML = `<i class="fa-solid fa-arrow-up"></i> ${incomeTrendPercent}% from last month`;
    incomeTrend.className = 'trend positive';
    
    // For expenses, a decrease is positive
    expenseTrend.innerHTML = `<i class="fa-solid fa-arrow-down"></i> ${expenseTrendPercent}% from last month`;
    expenseTrend.className = 'trend positive';
    
    balanceTrend.innerHTML = `<i class="fa-solid fa-arrow-up"></i> ${balanceTrendPercent}% from last month`;
    balanceTrend.className = 'trend positive';

    // Check for budget warning
    checkBudgetWarning();
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
  
  // Open transaction modal
  function openTransactionModal() {
    transactionModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transaction-date').value = today;
    
    // Focus on first field
    document.getElementById('transaction-title').focus();
  }
  
  // Close transaction modal
  function closeTransactionModal() {
    transactionModal.classList.remove('active');
    document.body.style.overflow = '';
    transactionForm.reset();
  }
  
  // Open edit transaction modal
  function openEditTransactionModal(transaction) {
    editTransactionModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Fill form with transaction data
    document.getElementById('edit-transaction-id').value = transaction.id;
    document.getElementById('edit-transaction-title').value = transaction.title;
    document.getElementById('edit-transaction-amount').value = transaction.amount;
    document.getElementById('edit-transaction-category').value = transaction.category;
    document.getElementById('edit-transaction-date').value = transaction.date;
    document.getElementById('edit-transaction-notes').value = transaction.notes || '';
    
    // Set transaction type
    if (transaction.entry_type === 'income') {
      document.getElementById('edit-income-type').checked = true;
    } else {
      document.getElementById('edit-expense-type').checked = true;
    }
  }
  
  // Close edit transaction modal
  function closeEditTransactionModal() {
    editTransactionModal.classList.remove('active');
    document.body.style.overflow = '';
    editTransactionForm.reset();
  }
  
  // Handle outside click on modal
  function handleOutsideClick(e) {
    if (e.target === transactionModal) {
      closeTransactionModal();
    } else if (e.target === editTransactionModal) {
      closeEditTransactionModal();
    }
  }
  
  // Create transaction item
  function createTransactionItem(transaction) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.setAttribute('data-id', transaction.id);
    item.setAttribute('data-type', transaction.entry_type);
    
    // Get icon based on category
    let icon = 'fa-question';
    if (transaction.entry_type === 'income') {
      icon = 'fa-arrow-down';
    } else {
      switch(transaction.category) {
        case 'food': icon = 'fa-utensils'; break;
        case 'travel': icon = 'fa-plane'; break;
        case 'bills': icon = 'fa-file-invoice-dollar'; break;
        default: icon = 'fa-ellipsis';
      }
    }
    
    // Format date
    const date = new Date(transaction.date);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    item.innerHTML = `
      <div class="transaction-icon ${transaction.entry_type}">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="transaction-details">
        <div class="transaction-title">${transaction.title}</div>
        <div class="transaction-info">
          <span>${formattedDate}</span>
          <span>${transaction.category ? transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1) : ''}</span>
        </div>
      </div>
      <div class="transaction-amount ${transaction.entry_type}">
        ${transaction.entry_type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}
      </div>
    `;
    
    // Add click event to open edit modal
    item.addEventListener('click', () => {
      openEditTransactionModal(transaction);
    });
    
    return item;
  }
  
  // Render transactions
  function renderTransactions(filter = 'all') {
    transactionsList.innerHTML = '';
    
    const filteredTransactions = transactions.filter(t => {
      if (filter === 'all') return true;
      if (filter === 'income' || filter === 'expense') return t.entry_type === filter;
      return t.category === filter;
    });
    
    if (filteredTransactions.length === 0) {
      transactionsList.innerHTML = `
        <div class="empty-state">
          <p>No transactions found</p>
        </div>
      `;
      return;
    }
    
    // Sort by date (most recent first)
    filteredTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(transaction => {
        const item = createTransactionItem(transaction);
        transactionsList.appendChild(item);
        
        // Add entrance animation
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      });
  }
  
  // Save transaction
  function saveTransaction(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(transactionForm);
    const transaction = {
      id: transactions.length + 1,
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount')),
      date: formData.get('date'),
      category: formData.get('category'),
      notes: formData.get('notes'),
      entry_type: formData.get('entry_type')
    };
    
    // Add to transactions array
    transactions.push(transaction);
    
    // Close modal and refresh
    closeTransactionModal();
    renderTransactions();
    
    // Recalculate financial summary
    calculateFinancialSummary();
    
    // Show success notification
    showNotification('Transaction added successfully!');
    
    // Add a bounce animation to the respective card
    const cardToAnimate = transaction.entry_type === 'income' ? 
      document.querySelector('.income-card') : 
      document.querySelector('.expense-card');
    
    cardToAnimate.classList.add('bounce');
    setTimeout(() => {
      cardToAnimate.classList.remove('bounce');
    }, 1000);
  }
  
  // Update transaction
  function updateTransaction(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(editTransactionForm);
    const updatedTransaction = {
      id: parseInt(formData.get('id')),
      title: formData.get('title'),
      amount: parseFloat(formData.get('amount')),
      date: formData.get('date'),
      category: formData.get('category'),
      notes: formData.get('notes'),
      entry_type: formData.get('entry_type')
    };
    
    // Get original transaction to check if type changed
    const originalTransaction = transactions.find(t => t.id === updatedTransaction.id);
    const typeChanged = originalTransaction.entry_type !== updatedTransaction.entry_type;
    
    // Update transactions array
    transactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    
    // Close modal and refresh
    closeEditTransactionModal();
    renderTransactions();
    
    // Recalculate financial summary
    calculateFinancialSummary();
    
    // Show success notification
    showNotification('Transaction updated successfully!');
    
    // Animate affected cards if type changed
    if (typeChanged) {
      if (originalTransaction.entry_type === 'income') {
        // Changed from income to expense
        document.querySelector('.income-card').classList.add('bounce');
        document.querySelector('.expense-card').classList.add('bounce');
        setTimeout(() => {
          document.querySelector('.income-card').classList.remove('bounce');
          document.querySelector('.expense-card').classList.remove('bounce');
        }, 1000);
      } else {
        // Changed from expense to income
        document.querySelector('.expense-card').classList.add('bounce');
        document.querySelector('.income-card').classList.add('bounce');
        setTimeout(() => {
          document.querySelector('.expense-card').classList.remove('bounce');
          document.querySelector('.income-card').classList.remove('bounce');
        }, 1000);
      }
    } else {
      // Just update the relevant card
      const cardToAnimate = updatedTransaction.entry_type === 'income' ? 
        document.querySelector('.income-card') : 
        document.querySelector('.expense-card');
      
      cardToAnimate.classList.add('bounce');
      setTimeout(() => {
        cardToAnimate.classList.remove('bounce');
      }, 1000);
    }
  }
  
  // Delete transaction
  function deleteTransaction() {
    const id = parseInt(document.getElementById('edit-transaction-id').value);
    
    // Get the transaction type before removal
    const transaction = transactions.find(t => t.id === id);
    const transactionType = transaction.entry_type;
    
    // Remove from transactions array
    transactions = transactions.filter(t => t.id !== id);
    
    // Close modal and refresh
    closeEditTransactionModal();
    renderTransactions();
    
    // Recalculate financial summary
    calculateFinancialSummary();
    
    // Show success notification
    showNotification('Transaction deleted successfully!');
    
    // Animate the affected card
    const cardToAnimate = transactionType === 'income' ? 
      document.querySelector('.income-card') : 
      document.querySelector('.expense-card');
    
    cardToAnimate.classList.add('bounce');
    setTimeout(() => {
      cardToAnimate.classList.remove('bounce');
    }, 1000);
  }
  
  // Filter transactions
  function filterTransactions() {
    const filterButtons = document.querySelectorAll('.dropdown-content a');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Apply filter
        const filter = this.getAttribute('data-filter');
        renderTransactions(filter);
      });
    });
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
    addTransactionBtn.addEventListener('click', openTransactionModal);
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => {
      closeTransactionModal();
      closeEditTransactionModal();
    }));
    cancelTransactionBtn.addEventListener('click', closeTransactionModal);
    cancelEditBtn.addEventListener('click', closeEditTransactionModal);
    deleteTransactionBtn.addEventListener('click', deleteTransaction);
    transactionModal.addEventListener('click', handleOutsideClick);
    editTransactionModal.addEventListener('click', handleOutsideClick);
    transactionForm.addEventListener('submit', saveTransaction);
    editTransactionForm.addEventListener('submit', updateTransaction);
    
    // Initialize features
    renderTransactions();
    filterTransactions();
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