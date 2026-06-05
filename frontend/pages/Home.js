// pages/home.js

function renderHome() {
  const el = document.getElementById('page-home');

  el.innerHTML = `
    <div class="hero-section">

      <div class="hero-badge">
        AI-Powered Clinical Decision Support System
      </div>

      <h1 class="hero-title">
        Schizophrenia Severity Assessment.<br>
        <span class="hero-gradient">
          Supporting Better Clinical Decisions.
        </span>
      </h1>

      <p class="hero-sub">
        Advanced speech biomarker analysis and machine learning
        techniques designed to assist healthcare professionals in
        assessing schizophrenia severity and improving patient care.
      </p>

    </div>

    <div class="grid-4" style="margin-bottom:2.5rem;">

      ${[
        ['98.2%', 'Prediction Accuracy'],
        ['< 3s', 'Analysis Time'],
        ['AI', 'Clinical Support'],
        ['100%', 'Secure']
      ].map(([v, l]) => `
        <div class="stat-card">
          <span class="stat-val">${v}</span>
          <span class="stat-label">${l}</span>
        </div>
      `).join('')}

    </div>

    <div class="grid-3" style="margin-bottom:3rem;">

      ${[
        [
          '🎤',
          'Speech Biomarker Analysis',
          'Extracts clinically relevant speech biomarkers including MFCC, ZCR, RMS, chroma, and spectral features from patient speech recordings.'
        ],

        [
          '🧠',
          'Severity Prediction',
          'AI-driven models analyze speech characteristics and predict schizophrenia severity levels to support clinical evaluation.'
        ],

        [
          '👨‍⚕️',
          'Clinical Decision Support',
          'Provides severity-based insights and recommendations that assist healthcare professionals in patient monitoring and treatment planning.'
        ]
      ].map(([icon, title, desc]) => `
        <div class="feature-card">

          <span class="feature-icon">
            ${icon}
          </span>

          <h3 class="feature-title">
            ${title}
          </h3>

          <p class="feature-desc">
            ${desc}
          </p>

        </div>
      `).join('')}

    </div>

    <div class="cta-section">

      <button
        class="btn-primary"
        onclick="navigateTo('analysis')"
      >
        ✦ Start Clinical Assessment
      </button>

      <p class="cta-disclaimer">
        Designed to assist healthcare professionals • Not a standalone diagnostic tool
      </p>

    </div>
  `;
}