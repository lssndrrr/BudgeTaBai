// pages/settings.jsx
import React, { useEffect, useState } from "react";
import Head from "next/head";
import "../styles/settingsstyles.css"; // Adjust path as needed

export default function SettingsPage() {
  // User info
  const [user, setUser] = useState({
    name: "Unknown",
    email: "Unknown Email",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
  });

  // Theme and sidebar
  const [darkTheme, setDarkTheme] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Budget and expenses
  const [weekly, setWeekly] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [annually, setAnnually] = useState(0);
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  // Modal
  const [logoutModal, setLogoutModal] = useState(false);

  // Transactions
  const [transactions, setTransactions] = useState([]);

  // Fetch user info
  useEffect(() => {
    async function fetchAccountInfo() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/accounts/me/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (response.ok) {
          const accountData = await response.json();
          setUser({
            name: accountData.name || "Unknown",
            email: accountData.email || "Unknown email",
            avatar:
              accountData.avatar ||
              "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
          });
        }
      } catch (error) {
        // handle error
      }
    }
    fetchAccountInfo();
    setDarkTheme(localStorage.getItem("dark-theme") === "true");
  }, []);

  // Fetch transactions and budget limits
  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/tracker/entries/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTransactions(
            data.map((t) => ({
              ...t,
              amount: parseFloat(t.amount) || 0,
            }))
          );
        }
      } catch (error) {
        // handle error
      }
    }
    async function fetchBudgetLimits() {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/tracker/budget/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setWeekly(data.weekly_limit || 0);
          setMonthly(data.monthly_limit || 0);
          setAnnually(data.annual_limit || 0);
        }
      } catch (error) {
        // handle error
      }
    }
    fetchTransactions();
    fetchBudgetLimits();
  }, []);

  // Calculate budget and expenses
  useEffect(() => {
    const budget =
      transactions
        .filter((t) => t.entry_type === "income")
        .reduce((sum, t) => sum + t.amount, 0) || 0;
    const expenses =
      transactions
        .filter((t) => t.entry_type === "expense")
        .reduce((sum, t) => sum + t.amount, 0) || 0;
    setBudgetLimit(budget);
    setTotalExpenses(expenses);
  }, [transactions]);

  // Update body class for theme
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("dark-theme", darkTheme);
  }, [darkTheme]);

  // Sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Theme switch
  const handleThemeSwitch = () => {
    setDarkTheme((prev) => !prev);
  };

  // Budget slider change
  const handleSliderChange = async (type, value) => {
    if (type === "weekly") setWeekly(value);
    if (type === "monthly") setMonthly(value);
    if (type === "annually") setAnnually(value);

    // Save to backend
    const payload = {};
    if (type === "weekly") payload.weekly_limit = parseFloat(value);
    if (type === "monthly") payload.monthly_limit = parseFloat(value);
    if (type === "annually") payload.annual_limit = parseFloat(value);

    try {
      await fetch("http://127.0.0.1:8000/api/tracker/budget/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // handle error
    }
  };

  // Logout logic
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return;
    }
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/logout/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );
      if (response.ok) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setLogoutModal(false);
        alert("Logged out successfully.");
        window.location.href = "/login";
      } else {
        alert("Failed to log out. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while logging out. Please try again.");
    }
  };

  // Budget warnings (optional: can add alerts if limits exceeded)
  useEffect(() => {
    // You can add warning logic here if you want to alert when limits are exceeded
  }, [weekly, monthly, annually, transactions]);

  return (
    <>
      <Head>
        <title>BudgeTaBai Settings</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <div className="settings">
        <aside className={`sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
          <div className="sidebar-header">
            <div className="logo">
              <i className="fa-solid fa-wallet"></i>
              <h1>BudgeTaBai</h1>
            </div>
            <button
              className="menu-toggle"
              id="menu-toggle"
              onClick={handleSidebarToggle}
            >
              <i
                className={`fa-solid ${
                  sidebarCollapsed ? "fa-times" : "fa-bars"
                }`}
              ></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <a href="/dashboard">
                  <i className="fa-solid fa-chart-line"></i>{" "}
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/overview">
                  <i className="fa-solid fa-chart-pie"></i>{" "}
                  <span>Overview</span>
                </a>
              </li>
              <li className="active">
                <a href="/settings">
                  <i className="fa-solid fa-gear"></i> <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
          <div className="sidebar-footer">
            <div className="theme-toggle">
              <span>Theme</span>
              <label className="switch">
                <input
                  type="checkbox"
                  id="theme-switch"
                  checked={darkTheme}
                  onChange={handleThemeSwitch}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="user-info">
              <img src={user.avatar} alt="User Avatar" />
              <div>
                <p className="user-name">{user.name}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="main-content">
          <header className="main-header">
            <div className="header-left">
              <h2>Settings</h2>
            </div>
          </header>
          <div className="budget-info">
            <p>
              Budget Limit: <span id="budget-limit">${budgetLimit.toFixed(2)}</span>
            </p>
            <p>
              Total Expenses: <span id="total-expenses">${totalExpenses.toFixed(2)}</span>
            </p>
          </div>
          <div className="overview-cards">
            <div className="card weekly-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fa-solid fa-calendar-week"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Weekly</h3>
                <input
                  type="range"
                  id="weekly-slider"
                  min="0"
                  max="10000"
                  value={weekly}
                  step="100"
                  onChange={(e) => handleSliderChange("weekly", e.target.value)}
                />
                <p className="amount">
                  Limit: $<span id="weekly-value">{weekly}</span>
                </p>
              </div>
            </div>
            <div className="card monthly-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fa-solid fa-calendar-alt"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Monthly</h3>
                <input
                  type="range"
                  id="monthly-slider"
                  min="0"
                  max="20000"
                  value={monthly}
                  step="100"
                  onChange={(e) => handleSliderChange("monthly", e.target.value)}
                />
                <p className="amount">
                  Limit: $<span id="monthly-value">{monthly}</span>
                </p>
              </div>
            </div>
            <div className="card annually-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fa-solid fa-calendar"></i>
                </div>
              </div>
              <div className="card-content">
                <h3>Annually</h3>
                <input
                  type="range"
                  id="annually-slider"
                  min="0"
                  max="100000"
                  value={annually}
                  step="500"
                  onChange={(e) => handleSliderChange("annually", e.target.value)}
                />
                <p className="amount">
                  Limit: $<span id="annually-value">{annually}</span>
                </p>
              </div>
            </div>
          </div>
          <button
            id="logout-button"
            className="btn-logout floating"
            onClick={() => setLogoutModal(true)}
          >
            Log out
          </button>
          {logoutModal && (
            <div id="logout-modal" className="modal active">
              <div className="modal-content">
                <p>Are you sure you want to log out?</p>
                <div className="modal-actions">
                  <button
                    id="confirm-logout"
                    className="btn-confirm"
                    onClick={handleLogout}
                  >
                    Yes, Log Out
                  </button>
                  <button
                    id="cancel-logout"
                    className="btn-cancel"
                    onClick={() => setLogoutModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}