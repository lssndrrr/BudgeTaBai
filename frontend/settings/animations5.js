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
    { id: 'weekly-slider', valueId: 'weekly-value' },
    { id: 'monthly-slider', valueId: 'monthly-value' },
    { id: 'annually-slider', valueId: 'annually-value' }
  ];

  sliders.forEach(({ id, valueId }) => {
    const slider = document.getElementById(id);
    const value = document.getElementById(valueId);
    if (slider && value) {
      value.textContent = slider.value; // Initialize the value
      slider.addEventListener('input', () => {
        value.textContent = slider.value; // Update the value dynamically
      });
    }
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

  
  
  initSliders();



  
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