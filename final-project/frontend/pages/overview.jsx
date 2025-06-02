// pages/overview.jsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Chart from "chart.js/auto";
import "../styles/overviewstyles.css"; // Adjust path as needed

export default function OverviewPage() {
  const [user, setUser] = useState({
    name: "Unknown",
    email: "Unknown Email",
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
  });
  const [darkTheme, setDarkTheme] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");

  // Chart refs
  const pieRef = useRef(null);
  const barRef = useRef(null);
  const pieChart = useRef(null);
  const barChart = useRef(null);

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

  // Fetch transactions
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
    fetchTransactions();
  }, []);

  // Update body class for theme
  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("dark-theme", darkTheme);
    // Update chart colors
    if (pieChart.current || barChart.current) {
      updateChartColors(darkTheme);
    }
  }, [darkTheme]);

  // Draw charts
  useEffect(() => {
    if (!pieRef.current || !barRef.current) return;
    if (!transactions.length) return;

    // Pie: Expenses by Category
    const expenseCategories = [
      "Food",
      "Travel",
      "Bills",
      "Entertainment",
      "Other",
    ];
    const expenseData = expenseCategories.map((cat) =>
      transactions
        .filter(
          (t) =>
            t.entry_type === "expense" &&
            t.category &&
            t.category.toLowerCase() === cat.toLowerCase()
        )
        .reduce((sum, t) => sum + t.amount, 0)
    );

    // Bar: Income vs Expenses by Month
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const incomeData = months.map((_, idx) =>
      transactions
        .filter(
          (t) =>
            t.entry_type === "income" &&
            t.date &&
            new Date(t.date).getMonth() === idx
        )
        .reduce((sum, t) => sum + t.amount, 0)
    );
    const expenseDataByMonth = months.map((_, idx) =>
      transactions
        .filter(
          (t) =>
            t.entry_type === "expense" &&
            t.date &&
            new Date(t.date).getMonth() === idx
        )
        .reduce((sum, t) => sum + t.amount, 0)
    );

    // Chart colors
    const textColor = darkTheme ? "#fff" : "#333";
    const gridColor = darkTheme ? "#555" : "#eee";

    // Pie Chart
    if (pieChart.current) pieChart.current.destroy();
    pieChart.current = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: expenseCategories,
        datasets: [
          {
            data: expenseData,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { size: 14, weight: "bold" },
            },
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    });

    // Bar Chart
    if (barChart.current) barChart.current.destroy();
    barChart.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "#36A2EB",
            borderRadius: 8,
            barThickness: 40,
          },
          {
            label: "Expense",
            data: expenseDataByMonth,
            backgroundColor: "#FF6384",
            borderRadius: 8,
            barThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: textColor,
              font: { weight: "bold" },
            },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor,
              font: { weight: "bold" },
            },
            grid: { color: gridColor },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: textColor,
              font: { size: 14, weight: "bold" },
            },
          },
        },
        animation: {
          duration: 1500,
          easing: "easeOutBounce",
        },
      },
    });

    // eslint-disable-next-line
  }, [transactions, darkTheme]);

  // Update chart colors on theme change
  function updateChartColors(isDark) {
    const textColor = isDark ? "#fff" : "#333";
    const gridColor = isDark ? "#555" : "#eee";
    if (pieChart.current) {
      pieChart.current.options.plugins.legend.labels.color = textColor;
      pieChart.current.update();
    }
    if (barChart.current) {
      barChart.current.options.plugins.legend.labels.color = textColor;
      barChart.current.options.scales.x.ticks.color = textColor;
      barChart.current.options.scales.y.ticks.color = textColor;
      barChart.current.options.scales.y.grid.color = gridColor;
      barChart.current.update();
    }
  }

  // Sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Theme switch
  const handleThemeSwitch = () => {
    setDarkTheme((prev) => !prev);
  };

  // Export CSV
  const handleExportCSV = async () => {
    setExporting(true);
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    if (category && category !== "all") params.append("category", category);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tracker/entries/export/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to export CSV. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while exporting the CSV. Please try again.");
    }
    setExporting(false);
  };

  return (
    <>
      <Head>
        <title>BudgeTaBai Overview</title>
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
              <li className="active">
                <a href="/overview">
                  <i className="fa-solid fa-chart-pie"></i>{" "}
                  <span>Overview</span>
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
              <h2>Overview</h2>
              <div className="filter-container">
                <div className="filter-group animated">
                  <label htmlFor="start-date">Export Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    className="filter-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="filter-group animated">
                  <label htmlFor="end-date">Export End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    name="end-date"
                    className="filter-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="filter-group animated">
                  <label htmlFor="category">Export Category:</label>
                  <select
                    id="category"
                    name="category"
                    className="filter-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="bills">Bills</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </header>
          <div className="overview-charts">
            <div className="chart-card">
              <h3>Expenses by Category</h3>
              <canvas id="expensesPieChart" ref={pieRef}></canvas>
            </div>
            <div className="chart-card">
              <h3>Monthly Income vs Expenses</h3>
              <canvas id="incomeExpenseBarChart" ref={barRef}></canvas>
            </div>
          </div>
          <button
            id="export-csv-button"
            className={`btn-export floating${exporting ? " clicked" : ""}`}
            onClick={handleExportCSV}
            disabled={exporting}
          >
            <i className="fas fa-download"></i> Export CSV
          </button>
        </main>
      </div>
    </>
  );
}