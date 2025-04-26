document.addEventListener('DOMContentLoaded', () => {
    const monthYearPicker = document.getElementById('monthYearPicker');
    
    // Set initial value to current month and year
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);
    monthYearPicker.value = currentMonth;
    
    // Update displayed date when month/year is changed
    monthYearPicker.addEventListener('change', (e) => {
        const selectedDate = new Date(e.target.value);
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        document.querySelector('.date').textContent = formattedDate;
        
        // You might want to filter expenses based on the selected month/year here
        // This is where you'd add that functionality
    });

    const addExpenseBtn = document.querySelector('.add-expense-btn');
    const expenseModal = document.getElementById('addExpenseModal');
    const editExpenseModal = document.getElementById('editExpenseModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const closeModalBtn = document.querySelectorAll('.close-modal');
    const cancelBtn = document.querySelectorAll('.cancel-btn');
    const expenseForm = document.getElementById('expenseForm');
    const editExpenseForm = document.getElementById('editExpenseForm');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const expenseItems = document.querySelectorAll('.expense-item');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const budgetAmountEl = document.querySelector('.budget-amount');
    const spentEl = document.querySelector('.spent');
    const remainingEl = document.querySelector('.remaining');
    const progressFillEl = document.querySelector('.progress-fill');
    const categoryTotals = {
      food: document.querySelector('.food-card .amount'),
      travel: document.querySelector('.travel-card .amount'),
      bills: document.querySelector('.bills-card .amount'),
      other: document.querySelector('.other-card .amount'),
    };
    const categoryProgress = {
      food: document.querySelector('.food-card .card-progress-fill'),
      travel: document.querySelector('.travel-card .card-progress-fill'),
      bills: document.querySelector('.bills-card .card-progress-fill'),
      other: document.querySelector('.other-card .card-progress-fill'),
    };
    
    // Static variables to hold data
    let expenses = [];
    let totalBudget = 0;
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-sidebar';
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m15 18-6-6 6-6"/>
      </svg>
    `;
    document.querySelector('.sidebar-header').appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded');
      
      const icon = toggleBtn.querySelector('svg');
      icon.style.transform = sidebar.classList.contains('collapsed') ? 'rotate(180deg)' : '';
    });
    
    const expenseDateInput = document.getElementById('expenseDate');
    if (expenseDateInput) {
      const today = new Date();
      const formattedDate = today.toISOString().substring(0, 10);
      expenseDateInput.value = formattedDate;
    }
    
    function animateElements(elements, animationClass, staggerDelay = 100) {
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add(animationClass);
        }, index * staggerDelay);
      });
    }
    
    function addEntranceAnimations() {
      const budgetCard = document.querySelector('.budget-card');
      if (budgetCard) {
        budgetCard.classList.add('fade-in');
      }
      
      const summaryCards = document.querySelectorAll('.summary-card');
      animateElements(summaryCards, 'slide-up', 150);
      
      animateElements(expenseItems, 'slide-left', 100);
    }
    
    function setupButtonAnimations() {
      if (addExpenseBtn) {
        addExpenseBtn.addEventListener('mouseenter', () => {
          addExpenseBtn.classList.add('pulse');
        });
        
        addExpenseBtn.addEventListener('mouseleave', () => {
          addExpenseBtn.classList.remove('pulse');
        });
      }
    }
    
    
    function openModal(modal) {
      if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; 
      }
    }
    
    function closeModal(modal) {
      if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; 
      }
    }
    
    function closeAllModals() {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        modal.classList.remove('show');
      });
      document.body.style.overflow = '';
    }
    
    function filterExpenses(category) {
      expenseItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.classList.add('slide-left');
          }, 10);
        } else {
          item.style.display = 'none';
          item.classList.remove('slide-left');
        }
      });
    }
    
    function updateActiveFilter(selectedBtn) {
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
      });
      selectedBtn.classList.add('active');
    }
    
    // ==================== Data Handling ====================
    
    function parseAmount(amountStr) {
      // Remove currency symbol and commas
      return parseFloat(amountStr.replace(/[₱,]/g, ''));
    }
    
    async function fetchBudget() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tracker/budget/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          totalBudget = parseFloat(data.total_budget); // Assign to static variable
          document.querySelector('.budget-amount').textContent = `₱${totalBudget.toFixed(2)}`;
          updateBudgetDisplay(); // Update the UI
        } else {
          console.error('Failed to fetch budget');
        }
      } catch (error) {
        console.error('Error fetching budget:', error);
      }
    }
    
    async function fetchEntries() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tracker/entries/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          expenses = data.map(entry => ({
            ...entry,
            amount: parseFloat(entry.amount), // Ensure `amount` is a number
          }));
          renderExpenses(); // Re-render the expenses list
        } else {
          console.error('Failed to fetch entries');
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    }
    
    function renderExpenses() {
      const expensesList = document.querySelector('.expenses-list');
      if (!expensesList) return;
    
      // Clear the existing list
      expensesList.innerHTML = '';
    
      // Loop through the static `expenses` array and render each expense
      expenses.forEach((entry) => {
        if (entry.entry_type === 'expense') {
          const expenseElement = document.createElement('div');
          expenseElement.className = 'expense-item';
          expenseElement.dataset.category = entry.category;
          expenseElement.dataset.id = entry.id;
    
          expenseElement.innerHTML = `
            <div class="expense-icon ${entry.category}">
              ${getCategoryIcon(entry.category)}
            </div>
            <div class="expense-details">
              <h3>${entry.title}</h3>
              <p class="expense-date">${formatDate(new Date(entry.date))}</p>
            </div>
            <div class="expense-amount">-${formatCurrency(parseFloat(entry.amount))}</div>
            <div class="expense-actions">
              <button class="expense-edit-btn" aria-label="Edit expense">
                <i class="fas fa-edit"></i>
              </button>
              <button class="expense-delete-btn" aria-label="Delete expense">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    
          expensesList.appendChild(expenseElement);
    
          // Add event listeners for edit and delete buttons
          const editBtn = expenseElement.querySelector('.expense-edit-btn');
          if (editBtn) {
            editBtn.addEventListener('click', () => handleEditClick(entry.id));
          }
    
          const deleteBtn = expenseElement.querySelector('.expense-delete-btn');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleDeleteClick(entry.id));
          }
        }
      });
    
      updateBudgetDisplay(); // Update totals and progress bars
    }

    async function addExpense(expenseData) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tracker/entries/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(expenseData),
        });
    
        if (response.ok) {
          const newExpense = await response.json();
          expenses.unshift(newExpense); // Add to static variable
          renderNewExpense(newExpense); // Render the new expense
          updateBudgetDisplay(); // Update totals and progress bars
          closeAllModals();
        } else {
          console.error('Failed to add expense');
        }
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    }
    
    async function editExpense(id, expenseData) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tracker/entries/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify(expenseData),
        });
    
        if (response.ok) {
          const updatedExpense = await response.json();
          const expenseIndex = expenses.findIndex((expense) => expense.id === id);
    
          if (expenseIndex !== -1) {
            expenses[expenseIndex] = updatedExpense; // Update the static variable
    
            // Update the UI to reflect the changes
            const expenseElement = document.querySelector(`.expense-item[data-id="${id}"]`);
    
            if (expenseElement) {
              // Update category class if changed
              if (expenseElement.dataset.category !== expenseData.category) {
                expenseElement.dataset.category = expenseData.category;
    
                const iconElement = expenseElement.querySelector('.expense-icon');
                if (iconElement) {
                  // Remove all category classes
                  iconElement.classList.remove('food', 'travel', 'bills', 'other');
                  // Add the new category class
                  iconElement.classList.add(expenseData.category);
    
                  // Update the icon SVG based on the category
                  iconElement.innerHTML = getCategoryIcon(expenseData.category);
                }
              }
    
              // Update expense title
              const titleElement = expenseElement.querySelector('.expense-details h3');
              if (titleElement) {
                titleElement.textContent = expenseData.title;
              }
    
              // Update expense date
              const dateElement = expenseElement.querySelector('.expense-date');
              if (dateElement) {
                dateElement.textContent = formatDate(new Date(expenseData.date));
              }
    
              // Update expense amount
              const amountElement = expenseElement.querySelector('.expense-amount');
              if (amountElement) {
                amountElement.textContent = `-${formatCurrency(parseFloat(expenseData.amount))}`;
              }
    
              // Add a quick highlight animation to show it's been updated
              expenseElement.classList.add('fade-in');
              setTimeout(() => {
                expenseElement.classList.remove('fade-in');
              }, 500);
            }
    
            updateBudgetDisplay();
          }
    
          closeAllModals();
        } else {
          console.error('Failed to edit expense');
        }
      } catch (error) {
        console.error('Error editing expense:', error);
      }
    }

    async function deleteExpense(id) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tracker/entries/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
    
        if (response.ok) {
          const expenseIndex = expenses.findIndex((expense) => expense.id === parseInt(id));
    
          if (expenseIndex !== -1) {
            // Remove from the expenses array
            expenses.splice(expenseIndex, 1);
    
            // Remove from the UI
            const expenseElement = document.querySelector(`.expense-item[data-id="${id}"]`);
    
            if (expenseElement) {
              // Add deletion animation
              expenseElement.style.opacity = '0';
              expenseElement.style.transform = 'translateX(-20px)';
              expenseElement.style.height = `${expenseElement.offsetHeight}px`;
    
              setTimeout(() => {
                expenseElement.style.height = '0';
                expenseElement.style.padding = '0';
                expenseElement.style.margin = '0';
                expenseElement.style.overflow = 'hidden';
    
                setTimeout(() => {
                  expenseElement.remove();
                }, 300);
              }, 300);
            }
    
            updateBudgetDisplay();
          }
    
          closeAllModals();
        } else {
          console.error('Failed to delete expense');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
    
    function formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
    
    function formatCurrency(amount) {
      return `₱${amount.toFixed(2)}`;
    }
    
    function getCategoryIcon(category) {
      const icons = {
        food: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8c0 4.5-2.5 8-7 8s-7-3.5-7-8 2.5-8 7-8 7 3.5 7 8Z"></path><path d="M17 8c0 4.5 2.5 8 7 8s7-3.5 7-8-2.5-8-7-8-7 3.5-7 8Z"></path><path d="M10 19c0 1.5 0 2 2.5 2s2.5-.5 2.5-2-1-2-2.5-2-2.5.5-2.5 2Z"></path></svg>',
        travel: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h1m16 0h1M5 17h14M5 12h14M7 7h10M12 7v10M3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3v9a5 5 0 0 1-9 3 5 5 0 0 1-9-3V8Z"></path></svg>',
        bills: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>',
        other: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>'
      };
      
      return icons[category] || icons.other;
    }
    
    function renderNewExpense(expense) {
      const expensesList = document.querySelector('.expenses-list');
    
      if (!expensesList) return;
    
      const expenseElement = document.createElement('div');
      expenseElement.className = 'expense-item';
      expenseElement.dataset.category = expense.category;
      expenseElement.dataset.id = expense.id;
      expenseElement.style.opacity = '0';
    
      expenseElement.innerHTML = `
        <div class="expense-icon ${expense.category}">
          ${getCategoryIcon(expense.category)}
        </div>
        <div class="expense-details">
          <h3>${expense.title}</h3>
          <p class="expense-date">${formatDate(new Date(expense.date))}</p>
        </div>
        <div class="expense-amount">-${formatCurrency(expense.amount)}</div>
        <div class="expense-actions">
          <button class="expense-edit-btn" aria-label="Edit expense">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="expense-delete-btn" aria-label="Delete expense">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    
      expensesList.prepend(expenseElement);
    
      // Add event listeners to the new buttons
      const editBtn = expenseElement.querySelector('.expense-edit-btn');
      if (editBtn) {
        editBtn.addEventListener('click', () => handleEditClick(expense.id));
      }
    
      const deleteBtn = expenseElement.querySelector('.expense-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeleteClick(expense.id));
      }
    
      setTimeout(() => {
        expenseElement.style.opacity = '1';
        expenseElement.classList.add('slide-left');
      }, 10);
    }
    
    function updateBudgetDisplay() {
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
      // Update spent amount
      const spentElement = document.querySelector('.spent');
      if (spentElement) {
        spentElement.textContent = `${formatCurrency(totalExpenses)} spent`;
      }
    
      // Use the global `totalBudget` variable for consistency
      const remainingElement = document.querySelector('.remaining');
      if (remainingElement) {
        const remaining = totalBudget - totalExpenses;
        remainingElement.textContent = `${formatCurrency(remaining)} left`;
      }
    
      // Update the progress bar
      const progressFill = document.querySelector('.progress-fill');
      if (progressFill) {
        const percentage = Math.min((totalExpenses / totalBudget) * 100, 100);
        progressFill.style.width = `${percentage}%`;
    
        if (percentage >= 100) {
          progressFill.style.backgroundColor = 'var(--error)';
        } else if (percentage >= 80) {
          progressFill.style.backgroundColor = 'var(--warning)';
        } else {
          progressFill.style.backgroundColor = 'var(--primary)';
        }
      }
    
      // Update category-specific amounts and progress bars
      updateCategoryAmounts();
    }
    
    function updateCategoryAmounts() {
      const categories = ['food', 'travel', 'bills', 'other'];
    
      categories.forEach(category => {
        const categoryTotal = expenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0);
    
        const amountElement = document.querySelector(`.${category}-card .amount`);
        if (amountElement) {
          amountElement.textContent = `${formatCurrency(categoryTotal)}`;
        }
    
        const progressElement = document.querySelector(`.${category}-card .card-progress-fill`);
        if (progressElement) {
          const budgetAmountText = document.querySelector('.budget-amount')?.textContent || '₱5,000.00';
          const totalBudget = parseFloat(budgetAmountText.replace(/[₱,]/g, ''));
          const categoryBudget = totalBudget / 4;
    
          const percentage = Math.min((categoryTotal / categoryBudget) * 100, 100);
          progressElement.style.width = `${percentage}%`;
        }
      });
    }
    
    // ==================== Event Handlers ====================
    
    function handleEditClick(id) {
      const expense = expenses.find(exp => exp.id === parseInt(id));
      
      if (expense && editExpenseModal) {
        // Populate the edit form with the expense data
        document.getElementById('editExpenseId').value = expense.id;
        document.getElementById('editExpenseTitle').value = expense.title;
        document.getElementById('editExpenseAmount').value = expense.amount;
        document.getElementById('editExpenseCategory').value = expense.category;
        
        // Convert the date string to a valid input date format
        const dateParts = expense.date.split(' ');
        const month = new Date(`${dateParts[0]} 1, 2000`).getMonth() + 1;
        const day = parseInt(dateParts[1].replace(',', ''));
        const year = parseInt(dateParts[2]);
        
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        document.getElementById('editExpenseDate').value = formattedDate;
        
        openModal(editExpenseModal);
      }
    }
    
    function handleDeleteClick(id) {
      if (deleteConfirmModal) {
        document.getElementById('deleteExpenseId').value = id;
        openModal(deleteConfirmModal);
      }
    }
    
    // ==================== Event Listeners ====================
    
    if (addExpenseBtn) {
      addExpenseBtn.addEventListener('click', () => openModal(expenseModal));
    }
    
    closeModalBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });
    
    cancelBtn.forEach(btn => {
      btn.addEventListener('click', () => {
        closeAllModals();
      });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });
    
    if (expenseForm) {
      expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
          title: document.getElementById('expenseTitle').value,
          amount: document.getElementById('expenseAmount').value,
          category: document.getElementById('expenseCategory').value,
          date: document.getElementById('expenseDate').value
        };
        
        addExpense(formData);
        expenseForm.reset();
        
        if (expenseDateInput) {
          expenseDateInput.value = new Date().toISOString().substring(0, 10);
        }
      });
    }
    
    if (editExpenseForm) {
      editExpenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editExpenseId').value);
        const formData = {
          title: document.getElementById('editExpenseTitle').value,
          amount: document.getElementById('editExpenseAmount').value,
          category: document.getElementById('editExpenseCategory').value,
          date: document.getElementById('editExpenseDate').value
        };
        
        editExpense(id, formData);
      });
    }
    
    const deleteConfirmButton = document.querySelector('#deleteConfirmModal .delete-btn');
    if (deleteConfirmButton) {
      deleteConfirmButton.addEventListener('click', () => {
        const id = document.getElementById('deleteExpenseId').value;
        deleteExpense(id);
      });
    }
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;
        filterExpenses(category);
        updateActiveFilter(button);
      });
    });
    
    // Add edit and delete event listeners to existing expenses
    document.querySelectorAll('.expense-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const expenseItem = e.target.closest('.expense-item');
        if (expenseItem) {
          handleEditClick(parseInt(expenseItem.dataset.id));
        }
      });
    });
    
    document.querySelectorAll('.expense-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const expenseItem = e.target.closest('.expense-item');
        if (expenseItem) {
          handleDeleteClick(expenseItem.dataset.id);
        }
      });
    });
    
    function setupMobileNav() {
      const mobileMenuBtn = document.createElement('button');
      mobileMenuBtn.className = 'mobile-menu-btn';
      mobileMenuBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      `;
      
      document.querySelector('.dashboard-title')?.prepend(mobileMenuBtn);
      
      const sidebar = document.querySelector('.sidebar');
      
      mobileMenuBtn.addEventListener('click', () => {
        sidebar?.classList.toggle('show');
      });
      
      document.addEventListener('click', (e) => {
        if (
          sidebar?.classList.contains('show') && 
          !sidebar.contains(e.target) && 
          e.target !== mobileMenuBtn
        ) {
          sidebar.classList.remove('show');
        }
      });
    }
    
    function checkMobile() {
      if (window.innerWidth <= 768) {
        setupMobileNav();
      }
    }
    
    function init() {
      addEntranceAnimations();
      
      setupButtonAnimations();
      
      checkMobile();
      
      // Fetch budget and entries for initial display
      fetchBudget();
      fetchEntries();

      updateBudgetDisplay();
      
      const style = document.createElement('style');
      style.textContent = `
        .modal-content {
          transition: transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        @media (max-width: 768px) {
          .mobile-menu-btn {
            background: none;
            border: none;
            color: var(--text-dark);
            font-size: 1.5rem;
            cursor: pointer;
            padding: var(--space-2);
            margin-right: var(--space-2);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Initialize the application
    init();

    const editBudgetBtn = document.querySelector('.budget-edit');
    const editBudgetModal = document.getElementById('editBudgetModal');
    const newBudgetAmountInput = document.getElementById('newBudgetAmount');
    const editBudgetForm = document.getElementById('editBudgetForm');

    if (editBudgetBtn) {
      editBudgetBtn.addEventListener('click', () => {
        if (editBudgetModal) {
          editBudgetModal.classList.add('show');
          document.body.style.overflow = 'hidden';
        }
      });
    }

    if (editBudgetModal) {
      const closeModalBtns = editBudgetModal.querySelectorAll('.close-modal, .cancel-btn');
      closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          editBudgetModal.classList.remove('show');
          document.body.style.overflow = '';
        });
      });
    }

    if (editBudgetForm) {
      editBudgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newBudgetAmount = parseFloat(newBudgetAmountInput.value);
    
        if (!isNaN(newBudgetAmount)) {
          try {
            // Send the updated budget to the API
            const response = await fetch('http://127.0.0.1:8000/api/tracker/budget/', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              },
              body: JSON.stringify({ total_budget: newBudgetAmount }),
            });
    
            if (response.ok) {
              // Update the local budget and UI
              totalBudget = newBudgetAmount;
              const budgetAmountElement = document.querySelector('.budget-amount');
              if (budgetAmountElement) {
                budgetAmountElement.textContent = `₱${newBudgetAmount.toFixed(2)}`;
              }
              editBudgetModal.classList.remove('show');
              document.body.style.overflow = '';
    
              updateBudgetDisplay();
            } else {
              console.error('Failed to update budget');
            }
          } catch (error) {
            console.error('Error updating budget:', error);
          }
        }
      });
    }
  });