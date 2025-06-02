// pages/dashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import "../styles/dashboardstyles.css"; // Adjust path as needed

const fetchAccountInfo = async (setUser) => {
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
};

export default function DashboardPage() {
  // State for user info
  const [user, setUser] = useState({
    name: "Unknown",
    email: "Unknown Email",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
  });

  // State for theme
  const [darkTheme, setDarkTheme] = useState(false);

  // State for sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // State for transactions (dummy for now)
  const [transactions, setTransactions] = useState([]);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // On mount: fetch user info and theme
  useEffect(() => {
    fetchAccountInfo(setUser);
    setDarkTheme(localStorage.getItem("dark-theme") === "true");
    // Add more initialization as needed
  }, []);

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

  // Modal handlers
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

  // ... Add more handlers for edit modal, transactions, etc.

  return (
    <>
      <Head>
        <title>BudgeTaBai Dashboard</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <div className="dashboard">
        <aside className={`sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
          <div className="sidebar-header">
            <div className="logo">
              <i className="fa-solid fa-wallet"></i>
              <h1>BudgeTaBai</h1>
            </div>
            <button className="menu-toggle" id="menu-toggle" onClick={handleSidebarToggle}>
              <i className={`fa-solid ${sidebarCollapsed ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            <ul>
              <li className="active">
                <a href="/dashboard">
                  <i className="fa-solid fa-chart-line"></i> <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/overview">
                  <i className="fa-solid fa-chart-pie"></i> <span>Overview</span>
                </a>
              </li>
              <li>
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
              <h2>Dashboard</h2>
            </div>
            <div className="header-right">
              <button className="btn btn-primary" id="add-transaction" onClick={openAddModal}>
                <i className="fa-solid fa-plus"></i> Add Entry
              </button>
            </div>
          </header>
          <div className="overview-cards">
            <div className="card income-card">
              <div className="card-icon">
                <i className="fa-solid fa-arrow-trend-up"></i>
              </div>
              <div className="card-content">
                <h3>Income</h3>
                <p className="amount">$0.00</p>
              </div>
            </div>
            <div className="card expense-card">
              <div className="card-icon">
                <i className="fa-solid fa-arrow-trend-down"></i>
              </div>
              <div className="card-content">
                <h3>Expenses</h3>
                <p className="amount">$0.00</p>
              </div>
            </div>
            <div className="card balance-card">
              <div className="card-icon">
                <i className="fa-solid fa-wallet"></i>
              </div>
              <div className="card-content">
                <h3>Balance</h3>
                <p className="amount">$0.00</p>
              </div>
            </div>
          </div>
          <div className="card transactions-card full-width">
            <div className="card-header">
              <h3>Entries</h3>
              <div className="card-actions">
                <div className="filter-dropdown">
                  <button className="btn-text">
                    <i className="fa-solid fa-filter"></i> Filter
                  </button>
                  <div className="dropdown-content">
                    <a href="#" data-filter="all" className="active">
                      All
                    </a>
                    <a href="#" data-filter="income">
                      Income
                    </a>
                    <a href="#" data-filter="expense">
                      Expense
                    </a>
                    <a href="#" data-filter="food">
                      Food
                    </a>
                    <a href="#" data-filter="travel">
                      Travel
                    </a>
                    <a href="#" data-filter="bills">
                      Bills
                    </a>
                    <a href="#" data-filter="other">
                      Other
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="transactions-list" id="transactions-list">
              {/* Render transactions here */}
            </div>
          </div>
        </main>
      </div>
      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="modal active" id="transaction-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Entry</h3>
              <button className="close-modal" onClick={closeAddModal}>
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* Add Transaction Form (implement as needed) */}
              <form id="transaction-form">
                {/* ...form fields... */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit Transaction Modal (implement as needed) */}
    </>
  );
}