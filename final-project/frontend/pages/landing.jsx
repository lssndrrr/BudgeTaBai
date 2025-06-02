// frontend/pages/landing.jsx
import React, { useEffect } from "react";
import Head from "next/head";
import "../Personal Budget Tracker/landingstyles.css"; // Adjust path as needed

export default function LandingPage() {
  useEffect(() => {
    // Animation: fadeInUp for elements
    const elements = [
      ...document.querySelectorAll(
        ".brand, .welcome-message, .subtitle, .start-button, .feature-list li"
      ),
    ];
    elements.forEach((el, idx) => {
      setTimeout(() => el.classList.add("fadeInUp"), 100 * idx);
    });

    // Parallax circles for desktop
    if (window.innerWidth >= 768) {
      const landingMain = document.querySelector(".landing-main");
      if (landingMain && !landingMain.querySelector(".design-elements")) {
        const design = document.createElement("div");
        design.className = "design-elements";
        design.innerHTML = `
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        `;
        landingMain.appendChild(design);
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

  return (
    <>
      <Head>
        <title>BudgeTaBai | Landing</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <div className="landing-page">
        {/* Header/Navbar */}
        <header className="landing-header">
          <div className="brand">
            <div className="logo-circle">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="logo-title">BudgeTaBai</div>
          </div>
          <div className="cta-buttons">
            <a href="/login" className="btn-primary">
              Log In
            </a>
            <a href="/signup" className="btn-secondary">
              Create Account
            </a>
          </div>
        </header>
        {/* Main Section */}
        <main className="landing-main">
          <div className="landing-content">
            <div className="content-left">
              <div className="welcome-message">Welcome to BudgeTaBai!</div>
              <p className="subtitle">
                Track your finances with ease. Stay on top of your spending, set goals, and budget smarter!
              </p>
              <div className="start-button">
                <a href="/login" className="btn-primary">
                  Let&apos;s start!
                </a>
              </div>
              <div className="feature-list">
                <div className="feature-title">Features:</div>
                <ul className="features">
                  <li>
                    <i className="fas fa-chart-line"></i> Real-time expense tracking
                  </li>
                  <li>
                    <i className="fas fa-piggy-bank"></i> Budget planning and tracking
                  </li>
                  <li>
                    <i className="fas fa-bell"></i> Smart notifications and reminders
                  </li>
                </ul>
              </div>
            </div>
            <div className="content-right">{/* Optionally add an image or gradient */}</div>
          </div>
        </main>
      </div>
    </>
  );
}