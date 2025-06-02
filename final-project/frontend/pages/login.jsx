// pages/login.jsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import "../styles/loginstyles.css"; // Adjust path as needed

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [swipeLeft, setSwipeLeft] = useState(false);

  // Animation effects
  useEffect(() => {
    // Fade in form elements
    const formEls = document.querySelectorAll(
      ".form-group, .brand, h2, .subtitle"
    );
    formEls.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add("fadeInUp");
      }, 100 * idx);
    });
    // Fade in social, signup, divider
    const fadeEls = document.querySelectorAll(
      ".social-login, .signup-prompt, .divider"
    );
    fadeEls.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add("fadeIn");
      }, 500 + 100 * idx);
    });
    // Parallax circles for login-info
    if (window.innerWidth >= 768) {
      const loginInfo = document.querySelector(".login-info");
      if (loginInfo && !loginInfo.querySelector(".design-elements")) {
        const design = document.createElement("div");
        design.className = "design-elements";
        design.innerHTML = `
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        `;
        loginInfo.appendChild(design);
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

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        setLoginError(errorData.detail || "Invalid credentials");
      }
    } catch (err) {
      setLoginError("An error occurred. Please try again.");
    }
    setLoginLoading(false);
  };

  // Handle swipe left for create account
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setSwipeLeft(true);
    setTimeout(() => {
      window.location.href = "/signup";
    }, 500);
  };

  return (
    <>
      <Head>
        <title>Budget Tracker | Login</title>
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
        <div className="login-wrapper">
          <div className="login-card">
            <div className="brand">
              <div className="logo">
                <div className="logo-circle">
                  <i className="fas fa-wallet"></i>
                </div>
              </div>
              <h1>BudgeTaBai</h1>
            </div>
            <h2>Hello!</h2>
            <p className="subtitle">
              Enter your credentials to access your account
            </p>
            <form id="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <i className="fas fa-envelope input-icon"></i>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <p className="error-message" id="email-error"></p>
              </div>
              <div className="form-group">
                <div className="password-label-group">
                  <label htmlFor="password">Password</label>
                  <a href="#" className="forgot-password" aria-label="Forgot password">
                    Forgot password?
                  </a>
                </div>
                <div className="input-wrapper">
                  <i className="fas fa-lock input-icon" aria-hidden="true"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    required
                    aria-label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      }`}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
                <p className="error-message" id="password-error" aria-live="polite">
                  {loginError}
                </p>
              </div>
              <div className="form-group remember-group">
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="remember-me" aria-label="Remember me" />
                  <label htmlFor="remember-me" className="checkbox-label">
                    Remember me
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className={`btn-login${loginLoading ? " loading" : ""}`}
                disabled={loginLoading}
              >
                <span className="btn-text">Log In</span>
                <span className="btn-loader"></span>
              </button>
            </form>
            <div className="signup-prompt">
              <p>
                Don&apos;t have an account?{" "}
                <a href="/signup" className="create-account-btn" onClick={handleCreateAccount}>
                  Create account
                </a>
              </p>
            </div>
          </div>
          <div className={`login-info${swipeLeft ? " swipe-left" : ""}`}>
            <div className="info-wrapper">
              <h3>Track your finances with ease</h3>
              <p>
                BudgeTaBai helps you monitor expenses, and give you your overall summary of your
                expenses either the past week or the past month.
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
        </div>
      </div>
    </>
  );
}