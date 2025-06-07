const API_BASE_URL = "https://budgetab-ai-backend.onrender.com/";

document.addEventListener('DOMContentLoaded', () => {
  const formElements = document.querySelectorAll('.form-group, .brand, h2, .subtitle');

  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes swipeLeft {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-100%);
      }
    }
    
    .fadeInUp {
      animation: fadeInUp 0.5s ease forwards;
    }
    
    .fadeIn {
      animation: fadeIn 0.5s ease forwards;
    }
    
    .pulse {
      animation: pulse 0.3s ease;
    }
    
    .btn-login.success {
      background-color: var(--color-success-500);
    }
    
    /* Staggered animation for form elements */
    .form-group, .brand, h2, .subtitle {
      opacity: 0;
    }
    
    /* Input focus effects */
    input:focus {
      transform: scale(1.01);
    }
    
    /* Button hover animation */
    .btn-login:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(51, 102, 255, 0.2);
    }
    
    /* Social button hover animation */
    .btn-social:hover {
      transform: translateY(-1px);
    }
    
    /* Rotate effect for toggle password */
    .toggle-password:active i {
      transform: rotate(180deg);
      transition: transform 0.3s ease;
    }

    .login-info.swipe-left {
      animation: swipeLeft 0.5s ease forwards;
    }
  `;
  document.head.appendChild(styleEl);

  formElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('fadeInUp');
    }, 100 * index);
  });

  const fadeElements = document.querySelectorAll('.social-login, .signup-prompt, .divider');
  fadeElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('fadeIn');
    }, 500 + (100 * index));
  });

  const interactiveElements = document.querySelectorAll('button, input, a');
  interactiveElements.forEach(element => {
    element.addEventListener('mousedown', () => {
      element.classList.add('pulse');
      setTimeout(() => {
        element.classList.remove('pulse');
      }, 300);
    });
  });

  if (window.innerWidth >= 768) {
    const loginInfo = document.querySelector('.login-info');

    if (loginInfo) {
      const designElements = document.createElement('div');
      designElements.classList.add('design-elements');
      designElements.innerHTML = `
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      `;
      loginInfo.appendChild(designElements);

      const parallaxStyle = document.createElement('style');
      parallaxStyle.textContent = `
        .login-info {
          position: relative;
          overflow: hidden;
        }
        
        .design-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }
        
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .circle-1 {
          width: 300px;
          height: 300px;
          bottom: -100px;
          right: -100px;
        }
        
        .circle-2 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: -50px;
        }
        
        .circle-3 {
          width: 150px;
          height: 150px;
          top: 50%;
          right: 30%;
          background: rgba(255, 184, 0, 0.15);
        }
      `;
      document.head.appendChild(parallaxStyle);

      document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const circle1 = document.querySelector('.circle-1');
        const circle2 = document.querySelector('.circle-2');
        const circle3 = document.querySelector('.circle-3');

        if (circle1 && circle2 && circle3) {
          circle1.style.transform = `translate(${x * 30}px, ${y * -30}px)`;
          circle2.style.transform = `translate(${x * -20}px, ${y * 20}px)`;
          circle3.style.transform = `translate(${x * 15}px, ${y * -15}px)`;
        }
      });
    }
  }

  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
      const input = button.previousElementSibling;
      const icon = button.querySelector('i');
      if (input && input.type === 'password') {
        input.type = 'text';
        if (icon) icon.classList.replace('fa-eye-slash', 'fa-eye');
      } else if (input) {
        input.type = 'password';
        if (icon) icon.classList.replace('fa-eye', 'fa-eye-slash');
      }
    });
  });

  const createAccountBtn = document.querySelector('.create-account-btn');
  const loginInfo = document.querySelector('.login-info');

  if (createAccountBtn && loginInfo) {
    createAccountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginInfo.classList.add('swipe-left'); 

      setTimeout(() => {
        window.location.href = createAccountBtn.href; 
      }, 500); 
    });
  }

  // Login functionality
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(`${API_BASE_URL}accounts/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          alert('Login successful!');
          window.location.href = '../dashboard/dashboard.html';
        } else {
          const errorData = await response.json();
          alert('Login failed: ' + (errorData.detail || 'Invalid credentials'));
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }
});