// pages/signup.jsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import "../styles/signupstyles.css"; // Adjust path as needed

export default function SignupPage() {
  // Form state
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation effects
  useEffect(() => {
    // Fade in form elements
    document
      .querySelectorAll(".form-group, .brand, h2, .subtitle")
      .forEach((el, idx) => {
        setTimeout(() => el.classList.add("fadeInUp"), 100 * idx);
      });
    document.querySelectorAll(".login-prompt").forEach((el, idx) => {
      setTimeout(() => el.classList.add("fadeIn"), 500 + 100 * idx);
    });
    // Parallax circles for signup-info
    if (window.innerWidth >= 768) {
      const signupInfo = document.querySelector(".signup-info");
      if (signupInfo && !signupInfo.querySelector(".design-elements")) {
        const design = document.createElement("div");
        design.className = "design-elements";
        design.innerHTML = `
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        `;
        signupInfo.appendChild(design);
        document.addEventListener("mousemove", (e) => {
          const x = e.clientX / window.innerWidth;
          const y = e.clientY / window.innerHeight;
          const c1 = document.querySelector(".circle-1");
          const c2 = document.querySelector(".circle-2");
          const c3 = document.querySelector(".circle-3");
          if (c1 && c2 && c3) {
            c1.style.transform = `translate(${x * 30}px, ${y * -30}px)`;
            c2.style.transform = `translate(${x * -20}px, ${y * 20}px)`;
            c3.style.transform = `translate(${x * 15}px, ${y * -15}px)`;
          }
        });
      }
    }
  }, []);

  // Validation functions
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => password.length >= 8;
  const isValidName = (name) => name.length >= 2;
  const isValidUsername = (username) => /^[a-zA-Z0-9_]{4,}$/.test(username);

  // Real-time validation
  const validateField = (key, value) => {
    switch (key) {
      case "firstname":
      case "lastname":
        return isValidName(value) ? "" : "Invalid " + key;
      case "username":
        return isValidUsername(value) ? "" : "Invalid username";
      case "email":
        return isValidEmail(value) ? "" : "Invalid email";
      case "password":
        return isValidPassword(value) ? "" : "Password must be at least 8 characters";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  // Password toggle
  const handleTogglePassword = () => setShowPassword((v) => !v);

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setSuccess(false);

    // Prepare the data for the API call
    const signupData = {
      first_name: form.firstname,
      last_name: form.lastname,
      username: form.username,
      email: form.email,
      password: form.password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      if (response.ok) {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          alert("Account created successfully! Redirecting to login...");
          window.location.href = "/login";
        }, 1000);
      } else {
        const errorData = await response.json();
        let backendErrors = {};
        if (errorData.username) backendErrors.username = errorData.username.join(", ");
        if (errorData.email) backendErrors.email = errorData.email.join(", ");
        Object.keys(errorData).forEach((key) => {
          if (!backendErrors[key] && errorData[key]) {
            backendErrors[key] = errorData[key].join(", ");
          }
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Login link with swipe transition
  const handleLoginLink = (e) => {
    e.preventDefault();
    const signupInfo = document.querySelector(".signup-info");
    if (signupInfo) {
      signupInfo.style.transition = "transform 0.5s ease-in-out";
      signupInfo.style.transform = "translateX(100%)";
      signupInfo.addEventListener(
        "transitionend",
        () => {
          window.location.href = "/login";
        },
        { once: true }
      );
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      <Head>
        <title>Budget Tracker | Sign Up</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <div className="container">
        <div className="signup-wrapper">
          {/* Left Side Info */}
          <div className="signup-info">
            <div className="info-wrapper">
              <h3>Track your finances with ease</h3>
              <p>
                BudgeTaBai helps you monitor expenses and gives you a full summary of your past week or month's expenses.
              </p>
              <ul className="feature-list">
                <li>
                  <i className="fas fa-chart-line"></i> Real-time expense monitoring
                </li>
                <li>
                  <i className="fas fa-piggy-bank"></i> Set budget limitations
                </li>
                <li>
                  <i className="fas fa-bell"></i> Smart alerts and notifications
                </li>
              </ul>
            </div>
          </div>
          {/* Signup Form Card */}
          <div className="signup-card">
            <div className="brand">
              <div className="logo-circle">
                <i className="fas fa-wallet"></i>
              </div>
              <h1>BudgeTaBai</h1>
            </div>
            <h2>Create Account</h2>
            <p className="subtitle">Join us and start managing your finances today</p>
            <form id="signup-form" onSubmit={handleSubmit} autoComplete="off">
              <div className="name-group">
                <div className="form-group">
                  <label htmlFor="firstname">First Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user input-icon"></i>
                    <input
                      type="text"
                      id="firstname"
                      placeholder="Juan"
                      value={form.firstname}
                      onChange={handleInputChange}
                      required
                      className={errors.firstname ? "invalid" : ""}
                    />
                  </div>
                  <p className="error-message" id="firstname-error">
                    {errors.firstname}
                  </p>
                </div>
                <div className="form-group">
                  <label htmlFor="lastname">Last Name</label>
                  <div className="input-wrapper">
                    <i className="fas fa-user input-icon"></i>
                    <input
                      type="text"
                      id="lastname"
                      placeholder="Cruz"
                      value={form.lastname}
                      onChange={handleInputChange}
                      required
                      className={errors.lastname ? "invalid" : ""}
                    />
                  </div>
                  <p className="error-message" id="lastname-error">
                    {errors.lastname}
                  </p>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <i className="fas fa-at input-icon"></i>
                  <input
                    type="text"
                    id="username"
                    placeholder="juancruz143"
                    value={form.username}
                    onChange={handleInputChange}
                    required
                    className={errors.username ? "invalid" : ""}
                  />
                </div>
                <p className="error-message" id="username-error">
                  {errors.username}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope input-icon"></i>
                  <input
                    type="email"
                    id="email"
                    placeholder="juan@example.com"
                    value={form.email}
                    onChange={handleInputChange}
                    required
                    className={errors.email ? "invalid" : ""}
                  />
                </div>
                <p className="error-message" id="email-error">
                  {errors.email}
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                    className={errors.password ? "invalid" : ""}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    aria-label="Toggle password visibility"
                    onClick={handleTogglePassword}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                    ></i>
                  </button>
                </div>
                <p className="error-message" id="password-error">
                  {errors.password}
                </p>
              </div>
              <button
                type="submit"
                className={`btn-signup${loading ? " loading" : ""}${success ? " success" : ""}`}
                disabled={loading}
              >
                {success ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <>
                    <span className="btn-text">Create Account</span>
                    <span className="btn-loader"></span>
                  </>
                )}
              </button>
            </form>
            <div className="login-prompt">
              <p>
                Already have an account?{" "}
                <a href="/login" onClick={handleLoginLink}>
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}