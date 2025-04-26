document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const inputs = {
    firstname: document.getElementById('firstname'),
    lastname: document.getElementById('lastname'),
    username: document.getElementById('username'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
  };
  const errors = {
    firstname: document.getElementById('firstname-error'),
    lastname: document.getElementById('lastname-error'),
    username: document.getElementById('username-error'),
    email: document.getElementById('email-error'),
    password: document.getElementById('password-error'),
  };
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const signupBtn = document.querySelector('.btn-signup');

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
    .fadeInUp { animation: fadeInUp 0.5s ease forwards; }
    .fadeIn { animation: fadeIn 0.5s ease forwards; }
    .pulse { animation: pulse 0.3s ease; }
    .btn-signup.success { background-color: var(--color-success-500); }
    input:focus { transform: scale(1.01); }
    .btn-signup:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(51, 102, 255, 0.2); }
    .toggle-password:active i { transform: rotate(180deg); transition: transform 0.3s ease; }
  `;
  document.head.appendChild(style);

  // Validation Functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 8;
  const isValidName = (name) => name.length >= 2;
  const isValidUsername = (username) => /^[a-zA-Z0-9_]{4,}$/.test(username);

  // Real-time Validation
  const validators = {
    firstname: isValidName,
    lastname: isValidName,
    username: isValidUsername,
    email: isValidEmail,
    password: isValidPassword,
  };

  Object.keys(inputs).forEach((key) => {
    inputs[key].addEventListener('input', () => {
      if (inputs[key].value.trim() === '') {
        inputs[key].classList.remove('valid', 'invalid');
        errors[key].textContent = '';
      } else if (validators[key](inputs[key].value)) {
        inputs[key].classList.add('valid');
        inputs[key].classList.remove('invalid');
        errors[key].textContent = '';
      } else {
        inputs[key].classList.add('invalid');
        inputs[key].classList.remove('valid');
        errors[key].textContent = `Invalid ${key}`;
      }
    });
  });

  // Toggle Password
  togglePasswordBtn.addEventListener('click', () => {
    const type = inputs.password.getAttribute('type') === 'password' ? 'text' : 'password';
    inputs.password.setAttribute('type', type);
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye');
    togglePasswordBtn.querySelector('i').classList.toggle('fa-eye-slash');
    inputs.password.classList.add('pulse');
    setTimeout(() => inputs.password.classList.remove('pulse'), 300);
  });

  document.querySelectorAll('.form-group, .brand, h2, .subtitle').forEach((el, i) => {
    setTimeout(() => el.classList.add('fadeInUp'), i * 100);
  });
  document.querySelectorAll('.login-prompt').forEach((el, i) => {
    setTimeout(() => el.classList.add('fadeIn'), 500 + i * 100);
  });

  // Button Click Pulse
  document.querySelectorAll('button, input, a').forEach(el => {
    el.addEventListener('mousedown', () => {
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 300);
    });
  });

  // Parallax Circles
  if (window.innerWidth >= 768) {
    const signupInfo = document.querySelector('.signup-info');
    if (signupInfo) {
      const design = document.createElement('div');
      design.className = 'design-elements';
      design.innerHTML = `
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      `;
      signupInfo.appendChild(design);
      
      const circleStyle = document.createElement('style');
      circleStyle.textContent = `
        .signup-info { position: relative; overflow: hidden; }
        .design-elements { position: absolute; inset: 0; z-index: 1; }
        .circle { position: absolute; border-radius: 50%; background: rgba(255, 255, 255, 0.1); }
        .circle-1 { width: 300px; height: 300px; bottom: -100px; right: -100px; }
        .circle-2 { width: 200px; height: 200px; top: 10%; left: -50px; }
        .circle-3 { width: 150px; height: 150px; top: 50%; right: 30%; background: rgba(255, 184, 0, 0.15); }
      `;
      document.head.appendChild(circleStyle);

      document.addEventListener('mousemove', e => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        document.querySelector('.circle-1').style.transform = `translate(${x * 30}px, ${y * -30}px)`;
        document.querySelector('.circle-2').style.transform = `translate(${x * -20}px, ${y * 20}px)`;
        document.querySelector('.circle-3').style.transform = `translate(${x * 15}px, ${y * -15}px)`;
      });
    }
  }

  // Form Submit
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate all inputs
    Object.keys(inputs).forEach((key) => {
      if (!validators[key](inputs[key].value)) {
        inputs[key].classList.add('invalid');
        errors[key].textContent = `Invalid ${key}`;
        isValid = false;
      }
    });

    if (isValid) {
      signupBtn.classList.add('loading');

      // Prepare the data for the API call
      const signupData = {
        first_name: inputs.firstname.value,
        last_name: inputs.lastname.value,
        username: inputs.username.value,
        email: inputs.email.value,
        password: inputs.password.value,
      };

      try {
        // Send a POST request to the backend registration API
        const response = await fetch('http://127.0.0.1:8000/accounts/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        });

        if (response.ok) {
          // Success: Show success animation and redirect to login
          signupBtn.classList.remove('loading');
          signupBtn.classList.add('success');
          signupBtn.innerHTML = '<i class="fas fa-check"></i>';

          setTimeout(() => {
            alert('Account created successfully! Redirecting to login...');
            window.location.href = '../login/login.html';
          }, 1000);
        } else {
          // Handle errors from the backend
          const errorData = await response.json();
          Object.keys(errorData).forEach((key) => {
            if (errors[key]) {
              errors[key].textContent = errorData[key].join(', ');
              inputs[key].classList.add('invalid');
            }
          });
          signupBtn.classList.remove('loading');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred. Please try again.');
        signupBtn.classList.remove('loading');
      }
    }
  });

  // Login Link with Swipe Transition
  const loginLink = document.querySelector('.login-prompt a');
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      const signupInfo = document.querySelector('.signup-info');
      signupInfo.style.transition = 'transform 0.5s ease-in-out';
      signupInfo.style.transform = 'translateX(100%)';
      signupInfo.addEventListener(
        'transitionend',
        () => {
          window.location.href = loginLink.href;
        },
        { once: true }
      );
    });
  }
});