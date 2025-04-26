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