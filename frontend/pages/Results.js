// pages/results.js
function renderResults() {
  const el = document.getElementById('page-results');
  const score = window._predictionScore;

  if (score === undefined || score === null) {
    el.innerHTML = `
      <div class="nv-card" style="text-align:center; padding:3rem; margin-top:2rem;">
        <div style="font-size:3rem; margin-bottom:1rem;">📊</div>
        <h3 class="page-heading" style="font-size:1.4rem;">No Analysis Yet</h3>
        <p class="page-sub">Please complete a speech analysis first to view severity results.</p>
        <button class="btn-primary" onclick="navigateTo('analysis')" style="margin-top:1rem;">🎙 Go to Analysis</button>
      </div>
    `;
    return;
  }

  

let level, color, lightColor, bgColor;

if (score <= 2.5) {
    level = 'Minimal';
    color = '#00e8c0';
    lightColor = '#00e8c0';
    bgColor = 'rgba(0,232,192,.1)';
}
else if (score <= 5) {
    level = 'Mild';
    color = '#ffb840';
    lightColor = '#ffb840';
    bgColor = 'rgba(255,184,64,.1)';
}
else if (score <= 7.5) {
    level = 'Moderate';
    color = '#ff8c42';
    lightColor = '#ff8c42';
    bgColor = 'rgba(255,140,66,.1)';
}
else {
    level = 'Severe';
    color = '#ff4d6d';
    lightColor = '#ff4d6d';
    bgColor = 'rgba(255,77,109,.1)';
}

const pct = Math.min((score / 10) * 100, 100).toFixed(0);

  const notes = {
    Minimal:  'Minimal schizophrenia severity indicators detected. Maintain structured routines and monitor for any changes.',
    Mild:     'Mild schizophrenia severity indicators detected. Structured routines, stress-reduction strategies, and family support are advised.',
    Moderate: 'Moderate schizophrenia severity indicators detected. Professional psychiatric consultation and family support follow-up are recommended.',
    Severe:   'Significant schizophrenia severity markers present. Professional psychiatric clinical support and medication adherence review are recommended promptly.',
  };

  el.innerHTML = `
    <button class="back-btn" onclick="navigateTo('analysis')">← Analysis</button>

    <p class="page-label">Step 2 of 2</p>
    <h2 class="page-heading">Your Analysis Results</h2>

    <div class="grid-2" style="margin-top:1.5rem; align-items:start;">

      <!-- Score Card -->
      <div class="nv-card" style="text-align:center; padding:2.5rem 1.5rem;">
        <div class="score-ring" style="border-color:${color}; background:${bgColor};">
          <span class="score-val" style="color:${color};">${score.toFixed(1)}</span>
          <span class="score-unit">Severity Score</span>
        </div>

        <div class="severity-badge" style="background:${bgColor}; border:1px solid ${color}; color:${lightColor};">
          ${level} Severity
        </div>

        <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.82rem; line-height:1.6; margin:0 0 1.5rem;">
          Score derived from acoustic speech biomarkers — MFCCs, ZCR, RMS, and spectral features.
        </p>

        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%; background:linear-gradient(90deg,${color},${lightColor});"></div>
        </div>
        <p style="font-family:var(--font-body); font-size:0.72rem; color:#4b5563; text-align:right; margin:4px 0 1.5rem;">0 → 10 scale</p>

        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <button class="btn" onclick="navigateTo('support')">💚 View Support & Suggestions</button>
          <button class="btn" onclick="resetAnalysis()">↩ New Analysis</button>
        </div>
      </div>

      <!-- Spectrum & Note -->
      <div>
        <p class="page-label" style="margin-bottom:12px;">Severity Spectrum</p>
        <div style="background:rgba(17,24,39,0.6); border:1px solid var(--border); border-radius:14px; padding:1.5rem;">
          ${['Minimal','Mild','Moderate','Severe'].map((l, i) => {
            const colors = ['#00e8c0','#ffb840','#ff8c42','#ff4d6d'];
            const ranges = ['0 – 2.5','2.5 – 5','5 – 7.5','7.5 – 10'];
            const active = l === level;
            return `
              <div style="display:flex; align-items:center; gap:12px; margin-bottom:${i<3?'1rem':'0'};">
                <div style="width:10px; height:10px; border-radius:50%; background:${colors[i]}; flex-shrink:0; opacity:${active?1:0.3};"></div>
                <div style="flex:1; background:${colors[i]}; height:24px; border-radius:6px; opacity:${active?1:0.25};
                            display:flex; align-items:center; padding:0 10px;">
                  <span style="font-family:var(--font-body); font-size:0.78rem; color:#fff; font-weight:${active?'600':'400'};">${l}</span>
                </div>
                <span style="font-family:var(--font-body); font-size:0.75rem; color:var(--text-muted); width:50px; text-align:right;">${ranges[i]}</span>
              </div>
            `;
          }).join('')}

          <!-- Score marker -->
          <div style="margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border);">
            <p style="font-family:var(--font-body); font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">Your position on scale</p>
            <div style="background:#1f2937; border-radius:99px; height:8px; position:relative; overflow:visible;">
              <div style="height:8px; width:${pct}%; background:linear-gradient(90deg,${color},${lightColor}); border-radius:99px;"></div>
              <div style="position:absolute; top:-4px; left:calc(${pct}% - 8px); width:16px; height:16px;
                          border-radius:50%; background:${lightColor}; border:2px solid var(--bg); box-shadow:0 0 8px ${color};"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-family:var(--font-body); font-size:0.7rem; color:#4b5563; margin-top:4px;">
              <span>0</span><span>2.5</span><span>5</span><span>7.5</span><span>10</span>
            </div>
          </div>
        </div>

        <div class="clinical-note" style="border-left-color:${color};">
          <p class="clinical-note-label" style="color:${color};">Clinical Note</p>
          <p class="clinical-note-text">${notes[level]}</p>
        </div>
      </div>
    </div>
  `;
}

function resetAnalysis() {
  window._predictionScore = null;
  window._audioFile = null;
  navigateTo('analysis');
}