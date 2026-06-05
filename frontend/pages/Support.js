// pages/support.js
let currentActivity = null;

function renderSupport() {
  const el = document.getElementById('page-support');
  const score = window._predictionScore;

  el.innerHTML = `
    <button class="back-btn" onclick="navigateTo('results')">← Results</button>

    <div class="support-hero">
      <div style="font-size:3rem; margin-bottom:1rem;">💚</div>
      <h2 class="page-heading" style="font-size:2rem;">Wellness & Clinical Support Suggestions</h2>
      <p class="page-sub" style="margin-bottom:0; max-width:520px; margin-left:auto; margin-right:auto;">
        Choose an activity below for structured routines and clinical wellness support. All activities are private and run in your browser.
      </p>
    </div>

    <!-- Activity Grid -->
    <p class="page-label" style="margin-bottom:1rem;">Choose an Activity</p>
    <div class="activity-grid">
      <div class="activity-btn" onclick="openActivity('mandala')">
        <span class="act-icon">🌸</span>
        <span class="act-title">Mandala Art</span>
        <span class="act-desc">Color a mandala pattern with soothing hues</span>
      </div>
      <div class="activity-btn" onclick="openActivity('draw')">
        <span class="act-icon">✏️</span>
        <span class="act-title">Free Drawing</span>
        <span class="act-desc">Express yourself on a blank canvas</span>
      </div>
      <div class="activity-btn" onclick="openActivity('meditate')">
        <span class="act-icon">🧘</span>
        <span class="act-title">Meditate</span>
        <span class="act-desc">Guided breathing for stress reduction and calm</span>
      </div>
      <div class="activity-btn" onclick="openActivity('games')">
        <span class="act-icon">🎮</span>
        <span class="act-title">Mind Games</span>
        <span class="act-desc">Cognitive wellness and focusing exercises</span>
      </div>
      <div class="activity-btn" onclick="openActivity('journal')">
        <span class="act-icon">📓</span>
        <span class="act-title">Journal</span>
        <span class="act-desc">Write your thoughts freely and privately</span>
      </div>
      <div class="activity-btn" onclick="navigateTo('chat')">
        <span class="act-icon">💬</span>
        <span class="act-title">Clinical Assistant</span>
        <span class="act-desc">Talk to your AI clinical support assistant</span>
      </div>
    </div>

    <!-- Activity Panels -->
    <div id="activity-panel"></div>

    <!-- Emergency Section -->
    <div class="section-gap" style="text-align:center;">
      <p class="page-label">Need Immediate Help?</p>
      <h3 class="page-heading" style="font-size:1.3rem; margin-bottom:0.5rem;">Emergency Helplines</h3>
      <p class="page-sub" style="margin-bottom:1.5rem;">Immediate, confidential support available 24/7</p>
      <div class="grid-3" style="max-width:700px; margin:0 auto;">
        ${[
          ['iCall', '9152987821', '🇮🇳'],
          ['Vandrevala', '1860-2662-345', '🇮🇳'],
          ['AASRA', '9820466627', '🌐'],
        ].map(([name, num, flag]) => `
          <div class="nv-card" style="text-align:center; padding:1.25rem;">
            <div style="font-size:1.5rem; margin-bottom:0.5rem;">${flag}</div>
            <p style="font-family:var(--font-display); font-size:0.95rem; color:var(--text-primary); font-weight:700; margin-bottom:4px;">${name}</p>
            <p style="font-family:var(--font-body); font-size:0.88rem; color:var(--purple-light);">${num}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function openActivity(type) {
  currentActivity = type;
  const panel = document.getElementById('activity-panel');
  panel.style.marginTop = '2rem';
  panel.innerHTML = '';

  if (type === 'mandala')  renderMandala(panel);
  else if (type === 'draw') renderFreeDraw(panel);
  else if (type === 'meditate') renderMeditate(panel);
  else if (type === 'games') renderGames(panel);
  else if (type === 'journal') renderJournal(panel);

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ================================================================
// MANDALA ART
// ================================================================
function renderMandala(panel) {
  panel.innerHTML = `
    <div class="nv-card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 class="page-heading" style="font-size:1.4rem; margin-bottom:4px;">🌸 Mandala Coloring</h3>
          <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.85rem; margin:0;">Click any section of the mandala to fill it with your chosen color</p>
        </div>
        <button class="tool-btn" onclick="renderMandala(document.getElementById('activity-panel').querySelector('.nv-card').parentElement)">↺ New Pattern</button>
      </div>

      <!-- Color Palette -->
      <div class="color-palette" id="mandala-palette"></div>

      <!-- Brush Size -->
      <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem; font-family:var(--font-body); font-size:0.83rem; color:var(--text-secondary);">
        <span>Brush Size:</span>
        <input type="range" id="mandala-brush" min="4" max="24" value="10" style="width:120px; accent-color:var(--purple);">
        <button class="tool-btn" onclick="clearMandalaCanvas()">🗑 Clear</button>
        <button class="tool-btn" onclick="downloadCanvas('mandala-canvas')">⬇ Save</button>
      </div>

      <canvas id="mandala-canvas" width="700" height="500" style="max-width:100%; border-radius:12px;"></canvas>
    </div>
  `;

  const colors = ['#a78bfa','#60a5fa','#34d399','#f59e0b','#f87171','#fb923c','#e879f9','#38bdf8','#4ade80','#facc15','#f472b6','#ffffff','#94a3b8'];
  const palette = document.getElementById('mandala-palette');
  let selectedColor = colors[0];

  colors.forEach((c, i) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (i === 0 ? ' selected' : '');
    sw.style.background = c;
    sw.onclick = () => {
      document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
      selectedColor = c;
    };
    palette.appendChild(sw);
  });

  const canvas = document.getElementById('mandala-canvas');
  const ctx = canvas.getContext('2d');
  drawMandalaPattern(ctx, canvas.width, canvas.height);

  // Draw on canvas with symmetry
  let drawing = false;
  canvas.onmousedown = (e) => { drawing = true; drawMandalaPoint(e, canvas, ctx, () => selectedColor, () => parseInt(document.getElementById('mandala-brush').value)); };
  canvas.onmousemove = (e) => { if (drawing) drawMandalaPoint(e, canvas, ctx, () => selectedColor, () => parseInt(document.getElementById('mandala-brush').value)); };
  canvas.onmouseup = () => drawing = false;
  canvas.onmouseleave = () => drawing = false;
}

function drawMandalaPoint(e, canvas, ctx, getColor, getSize) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = getSize();
  const color = getColor();
  const symmetry = 8;

  ctx.fillStyle = color;
  for (let i = 0; i < symmetry; i++) {
    const angle = (Math.PI * 2 / symmetry) * i;
    const dx = x - cx, dy = y - cy;
    const rx = dx * Math.cos(angle) - dy * Math.sin(angle) + cx;
    const ry = dx * Math.sin(angle) + dy * Math.cos(angle) + cy;
    ctx.beginPath();
    ctx.arc(rx, ry, r, 0, Math.PI * 2);
    ctx.fill();
    // Mirror
    const mx = -dx * Math.cos(angle) + dy * Math.sin(angle) + cx;
    const my = -dx * Math.sin(angle) - dy * Math.cos(angle) + cy;
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawMandalaPattern(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;
  const layers = 7;
  const symmetry = 12;

  ctx.strokeStyle = 'rgba(167,139,250,0.35)';
  ctx.lineWidth = 1;

  for (let layer = 1; layer <= layers; layer++) {
    const r = layer * (Math.min(cx, cy) / layers);
    // Ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Petals
    for (let s = 0; s < symmetry; s++) {
      const angle = (Math.PI * 2 / symmetry) * s;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const pr = r * 0.4;
      const px = cx + (r + pr * 0.5) * Math.cos(angle);
      const py = cy + (r + pr * 0.5) * Math.sin(angle);

      // Spoke
      ctx.beginPath();
      ctx.moveTo(cx + (r - Math.min(cx,cy)/layers) * Math.cos(angle), cy + (r - Math.min(cx,cy)/layers) * Math.sin(angle));
      ctx.lineTo(x1, y1);
      ctx.stroke();

      // Petal
      if (layer % 2 === 0) {
        ctx.beginPath();
        ctx.arc(px, py, pr * 0.4, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Diamond
        const a = angle;
        const ds = pr * 0.35;
        ctx.beginPath();
        ctx.moveTo(cx + r * Math.cos(a) + ds * Math.cos(a), cy + r * Math.sin(a) + ds * Math.sin(a));
        ctx.lineTo(cx + r * Math.cos(a) + ds * Math.cos(a + Math.PI/2), cy + r * Math.sin(a) + ds * Math.sin(a + Math.PI/2));
        ctx.lineTo(cx + r * Math.cos(a) + ds * Math.cos(a + Math.PI), cy + r * Math.sin(a) + ds * Math.sin(a + Math.PI));
        ctx.lineTo(cx + r * Math.cos(a) + ds * Math.cos(a - Math.PI/2), cy + r * Math.sin(a) + ds * Math.sin(a - Math.PI/2));
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // Center
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(167,139,250,0.6)';
  ctx.stroke();
}

function clearMandalaCanvas() {
  const canvas = document.getElementById('mandala-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  drawMandalaPattern(ctx, canvas.width, canvas.height);
}

function downloadCanvas(id) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = 'neurovoice-art.png';
  a.href = canvas.toDataURL();
  a.click();
}

// ================================================================
// FREE DRAWING
// ================================================================
function renderFreeDraw(panel) {
  panel.innerHTML = `
    <div class="nv-card">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h3 class="page-heading" style="font-size:1.4rem; margin-bottom:4px;">✏️ Free Drawing</h3>
          <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.85rem; margin:0;">Express yourself — no rules, just create</p>
        </div>
      </div>

      <div class="canvas-toolbar">
        <div class="color-palette" id="draw-palette"></div>
        <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
          <span style="font-family:var(--font-body); font-size:0.8rem; color:var(--text-muted);">Size:</span>
          <input type="range" id="draw-brush" min="2" max="40" value="6" style="width:100px; accent-color:var(--purple);">
          <button class="tool-btn" id="eraser-btn" onclick="toggleEraser()">⬜ Eraser</button>
          <button class="tool-btn" onclick="clearDraw()">🗑 Clear</button>
          <button class="tool-btn" onclick="downloadCanvas('draw-canvas')">⬇ Save</button>
        </div>
      </div>

      <canvas id="draw-canvas" width="700" height="480" style="max-width:100%; border-radius:12px;"></canvas>
    </div>
  `;

  const colors = ['#a78bfa','#60a5fa','#34d399','#f59e0b','#f87171','#fb923c','#e879f9','#38bdf8','#4ade80','#facc15','#f472b6','#ffffff','#94a3b8','#1e293b'];
  const palette = document.getElementById('draw-palette');
  let selectedColor = '#a78bfa';
  let eraserOn = false;

  colors.forEach((c, i) => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (i === 0 ? ' selected' : '');
    sw.style.background = c;
    sw.onclick = () => {
      document.querySelectorAll('#draw-palette .color-swatch').forEach(s => s.classList.remove('selected'));
      sw.classList.add('selected');
      selectedColor = c;
      eraserOn = false;
      document.getElementById('eraser-btn').classList.remove('active');
    };
    palette.appendChild(sw);
  });

  window.toggleEraser = () => {
    eraserOn = !eraserOn;
    document.getElementById('eraser-btn').classList.toggle('active', eraserOn);
  };

  const canvas = document.getElementById('draw-canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let drawing = false, lastX = 0, lastY = 0;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
  }

  canvas.onmousedown = (e) => {
    drawing = true;
    [lastX, lastY] = getPos(e);
  };
  canvas.onmousemove = (e) => {
    if (!drawing) return;
    const [x, y] = getPos(e);
    const size = parseInt(document.getElementById('draw-brush').value);
    ctx.strokeStyle = eraserOn ? '#0d1117' : selectedColor;
    ctx.lineWidth = eraserOn ? size * 2 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
  };
  canvas.onmouseup = () => drawing = false;
  canvas.onmouseleave = () => drawing = false;

  window.clearDraw = () => {
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
}

// ================================================================
// MEDITATION / BREATHING
// ================================================================
function renderMeditate(panel) {
  let phase = 'ready', timer = null, step = 0;
  const phases = [
    { label: 'Inhale', duration: 4000, scale: 1.5 },
    { label: 'Hold',   duration: 4000, scale: 1.5 },
    { label: 'Exhale', duration: 4000, scale: 0.8 },
    { label: 'Hold',   duration: 4000, scale: 0.8 },
  ];

  panel.innerHTML = `
    <div class="nv-card" style="text-align:center; max-width:520px; margin:0 auto;">
      <h3 class="page-heading" style="font-size:1.4rem; margin-bottom:0.5rem;">🧘 Box Breathing</h3>
      <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.85rem; margin-bottom:2rem;">
        Follow the circle — inhale, hold, exhale, hold. 4 seconds each.
      </p>

      <div id="breath-circle" class="breath-circle">
        <span id="breath-label" style="font-weight:600;">Press Start</span>
      </div>

      <div id="breath-counter" style="font-family:var(--font-body); color:var(--text-muted); font-size:0.85rem; margin-bottom:1.5rem; min-height:24px;"></div>

      <!-- Step indicators -->
      <div style="display:flex; gap:8px; justify-content:center; margin-bottom:2rem;">
        ${phases.map((p,i) => `
          <div class="breath-step-dot" data-i="${i}" style="padding:6px 14px; border-radius:20px; border:1px solid var(--border);
               font-family:var(--font-body); font-size:0.78rem; color:var(--text-muted); transition:all 0.3s;">${p.label}</div>
        `).join('')}
      </div>

      <div style="display:flex; gap:1rem; justify-content:center;">
        <button class="btn-primary" id="breath-start-btn" onclick="startBreathing()" style="padding:0.6rem 2rem;">▶ Start</button>
        <button class="btn" id="breath-stop-btn" onclick="stopBreathing()" style="width:auto; padding:0.6rem 1.5rem; display:none;">⏹ Stop</button>
      </div>
    </div>
  `;

  window.startBreathing = function() {
    document.getElementById('breath-start-btn').style.display = 'none';
    document.getElementById('breath-stop-btn').style.display = 'inline-block';
    runBreath(0);
  };

  window.stopBreathing = function() {
    if (timer) clearTimeout(timer);
    document.getElementById('breath-circle').style.transform = 'scale(1)';
    document.getElementById('breath-label').textContent = 'Press Start';
    document.getElementById('breath-counter').textContent = '';
    document.getElementById('breath-start-btn').style.display = 'inline-block';
    document.getElementById('breath-stop-btn').style.display = 'none';
    document.querySelectorAll('.breath-step-dot').forEach(d => { d.style.background=''; d.style.color='var(--text-muted)'; d.style.borderColor='var(--border)'; });
  };

  function runBreath(i) {
    const p = phases[i % phases.length];
    const circle = document.getElementById('breath-circle');
    const label = document.getElementById('breath-label');
    if (!circle) return;

    document.querySelectorAll('.breath-step-dot').forEach(d => {
      const idx = parseInt(d.dataset.i);
      if (idx === i % phases.length) {
        d.style.background = 'rgba(167,139,250,0.15)';
        d.style.color = 'var(--purple-light)';
        d.style.borderColor = 'var(--purple-light)';
      } else {
        d.style.background = '';
        d.style.color = 'var(--text-muted)';
        d.style.borderColor = 'var(--border)';
      }
    });

    circle.style.transform = `scale(${p.scale})`;
    label.textContent = p.label;

    // Countdown
    let remaining = p.duration / 1000;
    const counter = document.getElementById('breath-counter');
    const countdown = setInterval(() => {
      if (!document.getElementById('breath-counter')) { clearInterval(countdown); return; }
      counter.textContent = `${remaining}s`;
      remaining--;
      if (remaining < 0) clearInterval(countdown);
    }, 1000);

    timer = setTimeout(() => runBreath(i + 1), p.duration);
  }
}

// ================================================================
// GAMES
// ================================================================
function renderGames(panel) {
  panel.innerHTML = `
    <div>
      <h3 class="page-heading" style="font-size:1.4rem; margin-bottom:0.5rem;">🎮 Mind Refreshing Games</h3>
      <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.85rem; margin-bottom:1.5rem;">Pick a game to relax and recharge your mind</p>
      <div class="games-grid">
        <div class="game-card" onclick="openGame('memory')">
          <div style="font-size:2.5rem;">🃏</div>
          <p class="game-title">Memory Match</p>
          <p class="game-desc">Find matching emoji pairs. Train your memory!</p>
        </div>
        <div class="game-card" onclick="openGame('breathing')">
          <div style="font-size:2.5rem;">🫧</div>
          <p class="game-title">Bubble Breathing</p>
          <p class="game-desc">Pop bubbles in rhythm to calm your nerves</p>
        </div>
        <div class="game-card" onclick="openGame('wordle')">
          <div style="font-size:2.5rem;">📝</div>
          <p class="game-title">Word Puzzle</p>
          <p class="game-desc">Guess the hidden 5-letter word in 6 tries</p>
        </div>
      </div>
      <div id="game-area" style="margin-top:1.5rem;"></div>
    </div>
  `;
}

function openGame(type) {
  const area = document.getElementById('game-area');
  if (type === 'memory') renderMemoryGame(area);
  else if (type === 'breathing') renderBubbleGame(area);
  else if (type === 'wordle') renderWordleGame(area);
}

// ---- MEMORY MATCH ----
function renderMemoryGame(area) {
  const emojis = ['🌸','🌈','⭐','🎵','💎','🦋','🍀','🎯'];
  let cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
  let flipped = [], matched = [], locked = false;

  area.innerHTML = `
    <div class="nv-card" style="text-align:center;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <h4 style="font-family:var(--font-display); font-size:1.1rem; color:var(--text-primary);">🃏 Memory Match</h4>
        <div style="display:flex; gap:0.5rem;">
          <span id="moves-count" style="font-family:var(--font-body); font-size:0.85rem; color:var(--text-secondary);">Moves: 0</span>
          <button class="tool-btn" onclick="renderMemoryGame(document.getElementById('game-area'))">↺ New Game</button>
        </div>
      </div>
      <div class="memory-grid" id="mem-grid"></div>
      <div id="mem-status" style="font-family:var(--font-body); color:var(--green); font-size:0.9rem; margin-top:1rem; min-height:24px;"></div>
    </div>
  `;

  let moves = 0;
  const grid = document.getElementById('mem-grid');

  cards.forEach((emoji, i) => {
    const card = document.createElement('div');
    card.className = 'mem-card';
    card.dataset.i = i;
    card.dataset.emoji = emoji;
    card.innerHTML = `<span class="card-face">${emoji}</span>`;
    card.onclick = () => flipCard(card);
    grid.appendChild(card);
  });

  function flipCard(card) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      locked = true;
      moves++;
      document.getElementById('moves-count').textContent = `Moves: ${moves}`;
      const [a, b] = flipped;
      if (a.dataset.emoji === b.dataset.emoji) {
        a.classList.add('matched'); b.classList.add('matched');
        matched.push(a, b);
        flipped = [];
        locked = false;
        if (matched.length === cards.length) {
          document.getElementById('mem-status').textContent = `🎉 You won in ${moves} moves!`;
        }
      } else {
        setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); flipped = []; locked = false; }, 900);
      }
    }
  }
}

// ---- BUBBLE BREATHING GAME ----
function renderBubbleGame(area) {
  area.innerHTML = `
    <div class="nv-card" style="text-align:center;">
      <h4 style="font-family:var(--font-display); font-size:1.1rem; color:var(--text-primary); margin-bottom:0.5rem;">🫧 Bubble Breathing</h4>
      <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.83rem; margin-bottom:1rem;">Click the bubble as it grows (inhale) then shrinks (exhale). Follow its rhythm.</p>
      <div id="bubble-area" style="position:relative; height:280px; display:flex; align-items:center; justify-content:center;">
        <div id="game-bubble" style="
          width:100px; height:100px; border-radius:50%;
          background:radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35), rgba(167,139,250,0.4));
          border:2px solid rgba(167,139,250,0.6);
          box-shadow: 0 0 30px rgba(124,58,237,0.3), inset 0 0 20px rgba(255,255,255,0.05);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:transform 3s ease-in-out, box-shadow 0.3s;
          user-select:none;">
          <span style="font-family:var(--font-body); font-size:0.78rem; color:rgba(255,255,255,0.7);" id="bubble-label">Inhale</span>
        </div>
      </div>
      <div id="bubble-score" style="font-family:var(--font-body); color:var(--text-muted); font-size:0.85rem; margin-top:0.5rem;">Score: 0</div>
    </div>
  `;

  let score = 0, growing = true;
  const bubble = document.getElementById('game-bubble');
  const lbl = document.getElementById('bubble-label');

  function cycle() {
    if (!document.getElementById('game-bubble')) return;
    if (growing) {
      bubble.style.transform = 'scale(2)';
      lbl.textContent = 'Inhale';
    } else {
      bubble.style.transform = 'scale(0.75)';
      lbl.textContent = 'Exhale';
    }
    growing = !growing;
    setTimeout(cycle, 3500);
  }

  bubble.onclick = () => {
    score++;
    document.getElementById('bubble-score').textContent = `Score: ${score} 🌟`;
    bubble.style.boxShadow = '0 0 60px rgba(167,139,250,0.6), inset 0 0 20px rgba(255,255,255,0.1)';
    setTimeout(() => { if (bubble) bubble.style.boxShadow = '0 0 30px rgba(124,58,237,0.3), inset 0 0 20px rgba(255,255,255,0.05)'; }, 400);
  };
  cycle();
}

// ---- WORD PUZZLE (Wordle-style) ----
function renderWordleGame(area) {
  const words = ['PEACE','SMILE','LIGHT','GRACE','BLOOM','CHILL','DANCE','GLEAM','HONEY','JOYFU'].filter(w => w.length === 5);
  const target = words[Math.floor(Math.random() * words.length)];
  let currentRow = 0, currentCol = 0, currentGuess = [];
  const maxRows = 6;

  area.innerHTML = `
    <div class="nv-card" style="text-align:center; max-width:420px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h4 style="font-family:var(--font-display); font-size:1.1rem; color:var(--text-primary);">📝 Word Puzzle</h4>
        <button class="tool-btn" onclick="renderWordleGame(document.getElementById('game-area'))">↺ New Word</button>
      </div>
      <p style="font-family:var(--font-body); font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
        🟩 = right place &nbsp; 🟨 = wrong place &nbsp; ⬛ = not in word
      </p>
      <div class="puzzle-grid" id="wordle-grid">
        ${Array.from({length: maxRows * 5}, () => `<div class="puzzle-cell" data-letter=""></div>`).join('')}
      </div>
      <div id="wordle-msg" style="font-family:var(--font-body); min-height:28px; margin:0.75rem 0; font-size:0.9rem; color:var(--text-secondary);"></div>
      <div class="word-keyboard" id="wordle-keys"></div>
    </div>
  `;

  // Keyboard
  const rows = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
  const keysDiv = document.getElementById('wordle-keys');
  rows.forEach(row => {
    row.split('').forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'key-btn';
      btn.dataset.key = ch;
      btn.textContent = ch;
      btn.onclick = () => handleKey(ch);
      keysDiv.appendChild(btn);
    });
    keysDiv.appendChild(Object.assign(document.createElement('div'), {style:'width:100%; height:0;'}));
  });

  // Enter + Backspace
  ['ENTER','⌫'].forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    btn.textContent = k;
    btn.style.padding = '0.5rem 1rem';
    btn.onclick = () => handleKey(k);
    keysDiv.appendChild(btn);
  });

  document.onkeydown = (e) => {
    if (!document.getElementById('wordle-grid')) { document.onkeydown = null; return; }
    if (e.key === 'Enter') handleKey('ENTER');
    else if (e.key === 'Backspace') handleKey('⌫');
    else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
  };

  function getCells() { return document.querySelectorAll('#wordle-grid .puzzle-cell'); }

  function handleKey(k) {
    if (currentRow >= maxRows) return;
    const cells = getCells();
    if (k === '⌫') {
      if (currentCol > 0) {
        currentCol--;
        currentGuess.pop();
        cells[currentRow * 5 + currentCol].textContent = '';
        cells[currentRow * 5 + currentCol].dataset.letter = '';
      }
    } else if (k === 'ENTER') {
      if (currentCol < 5) {
        document.getElementById('wordle-msg').textContent = 'Not enough letters';
        return;
      }
      submitGuess(cells);
    } else if (currentCol < 5) {
      cells[currentRow * 5 + currentCol].textContent = k;
      cells[currentRow * 5 + currentCol].dataset.letter = k;
      currentGuess.push(k);
      currentCol++;
    }
  }

  function submitGuess(cells) {
    const guess = currentGuess.join('');
    const targetArr = target.split('');
    const result = Array(5).fill('absent');

    // Mark correct
    guess.split('').forEach((ch, i) => { if (ch === targetArr[i]) result[i] = 'correct'; });
    // Mark present
    guess.split('').forEach((ch, i) => {
      if (result[i] !== 'correct' && targetArr.includes(ch)) result[i] = 'present';
    });

    result.forEach((r, i) => {
      const cell = cells[currentRow * 5 + i];
      cell.classList.add(r);
      const keyBtn = document.querySelector(`[data-key="${guess[i]}"]`);
      if (keyBtn) {
        if (r === 'correct') keyBtn.style.background = 'rgba(16,185,129,0.3)';
        else if (r === 'present' && keyBtn.style.background !== 'rgba(16,185,129,0.3)') keyBtn.style.background = 'rgba(245,158,11,0.3)';
        else if (r === 'absent') keyBtn.style.opacity = '0.4';
      }
    });

    if (guess === target) {
      document.getElementById('wordle-msg').innerHTML = `<span style="color:var(--green)">🎉 Brilliant! You got it!</span>`;
      document.onkeydown = null;
      return;
    }

    currentRow++;
    currentCol = 0;
    currentGuess = [];

    if (currentRow >= maxRows) {
      document.getElementById('wordle-msg').innerHTML = `<span style="color:var(--red)">The word was <b>${target}</b></span>`;
      document.onkeydown = null;
    }
  }
}

// ================================================================
// JOURNAL
// ================================================================
function renderJournal(panel) {
  panel.innerHTML = `
    <div class="nv-card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <h3 class="page-heading" style="font-size:1.4rem; margin-bottom:4px;">📓 My Journal</h3>
          <p style="font-family:var(--font-body); color:var(--text-secondary); font-size:0.85rem; margin:0;">Write freely — your words, your space. Nothing is saved to any server.</p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="tool-btn" onclick="clearJournal()">🗑 Clear</button>
          <button class="tool-btn" onclick="downloadJournal()">⬇ Save .txt</button>
        </div>
      </div>

      <div style="margin-bottom:1rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
        ${['How is my daily routine today?', 'Did I follow my medication schedule?', 'What structured goals did I achieve?', 'What coping strategies helped me today?'].map(p =>
          `<button class="tool-btn" onclick="addPrompt('${p}')">${p}</button>`
        ).join('')}
      </div>

      <textarea id="journal-text"
        style="width:100%; min-height:320px; background:#0d1117; border:1px solid var(--border); border-radius:12px;
               color:var(--text-primary); font-family:var(--font-body); font-size:0.95rem; line-height:1.7;
               padding:1.25rem; outline:none; resize:vertical; transition:border-color 0.2s;"
        placeholder="Start writing here... Let your thoughts flow freely."
        onfocus="this.style.borderColor='var(--purple)'"
        onblur="this.style.borderColor='var(--border)'"
      ></textarea>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem;">
        <span id="word-count" style="font-family:var(--font-body); font-size:0.78rem; color:var(--text-muted);">0 words</span>
        <span style="font-family:var(--font-body); font-size:0.78rem; color:var(--text-muted);">Private · Never stored</span>
      </div>
    </div>
  `;

  const ta = document.getElementById('journal-text');
  ta.addEventListener('input', () => {
    const words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
    document.getElementById('word-count').textContent = `${words} word${words !== 1 ? 's' : ''}`;
  });

  window.addPrompt = (p) => {
    ta.value += (ta.value ? '\n\n' : '') + p + '\n';
    ta.focus();
  };
  window.clearJournal = () => { ta.value = ''; document.getElementById('word-count').textContent = '0 words'; };
  window.downloadJournal = () => {
    const blob = new Blob([ta.value], { type: 'text/plain' });
    const a = document.createElement('a');
    a.download = 'my-journal.txt';
    a.href = URL.createObjectURL(blob);
    a.click();
  };
}