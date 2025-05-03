// === UI Animations ===

function toggleSidebar() {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");

  if (!menuToggle || !sidebar || !mainContent) return;

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");

    // Toggle icon
    const icon = menuToggle.querySelector("i");
    if (sidebar.classList.contains("collapsed")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }

    // For mobile
    if (window.innerWidth <= 1024) {
      sidebar.classList.toggle("active");
      document.body.classList.toggle("sidebar-open");
    }
  });
}

function themeToggle() {
  const themeSwitch = document.getElementById("theme-switch");
  if (!themeSwitch) return;

  // Load theme from localStorage
  if (localStorage.getItem("dark-theme") === "true") {
    document.body.classList.add("dark-theme");
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("dark-theme", isDark);
  });
}


function animateCards() {
  // Placeholder for card animations if needed in the future
}

// === Chart Rendering ===

function renderPieChart(data) {
  const ctx = document.getElementById("expensesPieChart");
  if (!ctx) return null;

  return new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [{
        label: "Expenses",
        data: data.values,
        backgroundColor: [
          "#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

function renderBarChart(data) {
  const ctx = document.getElementById("incomeExpenseBarChart");
  if (!ctx) return null;

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.labels,
      datasets: [
        { label: "Income", data: data.income, backgroundColor: "#34d399" },
        { label: "Expenses", data: data.expenses, backgroundColor: "#f87171" }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

// === Breakdown Table Renderer ===

function createBreakdownTable(chart) {
  if (!chart || !chart.data || !chart.data.datasets || !chart.data.datasets[0]) {
    console.warn("Chart data not available yet.");
    return null;
  }

  const labels = chart.data.labels;
  const data = chart.data.datasets[0].data;

  const tableContainer = document.createElement("div");
  tableContainer.classList.add("breakdown-table");
  tableContainer.innerHTML = "<h3>Expense Breakdown</h3>";

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Category</th><th>Amount (₱)</th></tr>";
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  labels.forEach((label, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${label}</td><td>${data[index]}</td>`;
    row.style.borderBottom = "1px solid #ccc";
    row.style.padding = "0.5rem";
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  return tableContainer;
}

// === Initialization ===

function initializeCharts() {
  // Mock data to simulate API response
  const mockPieData = {
    labels: ["Food", "Transport", "Utilities", "Entertainment", "Others"],
    values: [1200, 800, 500, 300, 200]
  };

  const mockBarData = {
    labels: ["January", "February", "March", "April"],
    income: [5000, 6000, 5500, 6200],
    expenses: [3200, 4000, 3700, 3900]
  };

  // Container for Pie Chart and Breakdown
  const overviewCharts = document.querySelector(".overview-charts");

  // === Pie Chart and Breakdown side by side ===
  const pieWrapper = document.createElement("div");
  pieWrapper.style.display = "flex";
  pieWrapper.style.gap = "2rem";
  pieWrapper.style.flexWrap = "wrap";
  pieWrapper.style.width = "100%";

  const pieCard = document.createElement("div");
  pieCard.className = "chart-card";
  pieCard.style.flex = "1";
  pieCard.style.minWidth = "300px";
  pieCard.innerHTML = `
    <h3 style="text-align: center;">Expenses by Category</h3>
    <canvas id="expensesPieChart"></canvas>
  `;

  pieWrapper.appendChild(pieCard);
  overviewCharts?.appendChild(pieWrapper);

  const pieChart = renderPieChart(mockPieData);

  const breakdownTable = createBreakdownTable(pieChart);
  if (breakdownTable) {
    breakdownTable.style.flex = "1";
    breakdownTable.style.minWidth = "250px";
    pieWrapper.appendChild(breakdownTable);
  }

  // === Bar Chart and breakdown below ===
  const barWrapper = document.createElement("div");
  barWrapper.className = "chart-card";
  barWrapper.style.width = "100%";
  barWrapper.style.marginTop = "4rem";
  barWrapper.innerHTML = `
    <h3 style="text-align: center;">Monthly Income vs Expenses</h3>
    <canvas id="incomeExpenseBarChart"></canvas>
  `;
  overviewCharts?.appendChild(barWrapper);

  renderBarChart(mockBarData);
}

// === Entry Point ===

document.addEventListener("DOMContentLoaded", () => {
  toggleSidebar();
  themeToggle();
  animateCards();
  initializeCharts();
});
