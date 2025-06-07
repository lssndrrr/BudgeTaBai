document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.brand, h2, .subtitle, .start-button, .feature-list li');
  
    // Create keyframes and styles
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
  
      .fadeInUp {
        animation: fadeInUp 0.6s ease forwards;
      }
  
      .fadeIn {
        animation: fadeIn 0.6s ease forwards;
      }
  
      /* Make clickable elements pulse */
      button:hover, a:hover {
        animation: pulse 0.3s ease;
      }
  
      /* Landing parallax circles */
      .design-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        z-index: 0;
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
    document.head.appendChild(styleEl);
  
    // Stagger fade-in for landing page elements
    elementsToAnimate.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fadeInUp');
      }, 100 * index);
    });
  
    // Add floating design circles if on desktop
    if (window.innerWidth >= 768) {
      const landingMain = document.querySelector('.landing-main');
      if (landingMain) {
        const designElements = document.createElement('div');
        designElements.classList.add('design-elements');
        designElements.innerHTML = `
          <div class="circle circle-1"></div>
          <div class="circle circle-2"></div>
          <div class="circle circle-3"></div>
        `;
        landingMain.appendChild(designElements);
  
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
  });
  