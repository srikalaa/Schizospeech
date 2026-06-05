// pages/analysis.js
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let recordingInterval = null;

function renderAnalysis() {
  const el = document.getElementById('page-analysis');
  el.innerHTML = `
    <button class="back-btn" onclick="navigateTo('home')">← Home</button>

    <p class="page-label">Step 1 of 2</p>
    <h2 class="page-heading">Speech-Based Schizophrenia Severity Analysis</h2>
    <p class="page-sub">Upload or record a speech sample to begin schizophrenia severity assessment.</p>

    <!-- Method Selection -->
    <div id="method-select" class="grid-2">
      <div class="method-card" onclick="showUpload()">
        <span class="method-icon">📁</span>
        <p class="method-title">Upload Speech Sample</p>
        <p class="method-desc">Upload a speech recording for clinical severity analysis.</p>
        <button class="btn">📁 Upload Speech Sample</button>
      </div>
      <div class="method-card" onclick="showRecord()">
        <span class="method-icon">🎙</span>
        <p class="method-title">Record Speech Sample</p>
        <p class="method-desc">Record a speech sample for schizophrenia severity evaluation.</p>
        <button class="btn">🎙 Record Speech Sample</button>
      </div>
    </div>

    <!-- Upload Section -->
    <div id="upload-section" class="input-section">
      <div class="grid-2">
        <div class="nv-card">
          <p class="page-label" style="margin-bottom:10px;">Upload Speech Sample</p>
          <input type="file" id="audio-upload" accept=".wav,.mp3,.ogg,.m4a"
            style="display:none" onchange="handleUpload(event)" />
          <div id="dropzone"
            style="border:2px dashed #374151; border-radius:12px; padding:2.5rem; text-align:center;
                   color:#6b7280; cursor:pointer; transition:all 0.2s; font-family:var(--font-body);"
            onclick="document.getElementById('audio-upload').click()"
            ondragover="event.preventDefault(); this.style.borderColor='#7c3aed';"
            ondragleave="this.style.borderColor='#374151';"
            ondrop="handleDrop(event)">
            <div style="font-size:2.5rem; margin-bottom:0.75rem;">📂</div>
            <p style="margin:0 0 4px;">Click to browse or drag & drop</p>
            <p style="font-size:0.78rem; color:#4b5563; margin:0;">WAV, MP3, OGG supported</p>
          </div>
          <div id="upload-preview" class="audio-preview" style="display:none;"></div>
        </div>
        <div class="nv-card" style="display:flex;align-items:center;justify-content:center;">
          <div style="text-align:center; color:#6b7280; font-family:var(--font-body); font-size:0.88rem;">
            <div style="font-size:2rem; margin-bottom:0.75rem;">📋</div>
            <p style="margin:0;">Tips for best results:</p>
            <ul style="text-align:left; margin-top:0.75rem; line-height:1.8; font-size:0.83rem;">
              <li>Speak for at least 10–15 seconds</li>
              <li>Use a quiet environment</li>
              <li>Speak naturally and clearly</li>
              <li>Hold the mic 15–20 cm from mouth</li>
            </ul>
          </div>
        </div>
      </div>
      <div id="upload-analyze-btn" style="text-align:center; margin-top:2rem; display:none;">
        <button class="btn-primary" onclick="analyzeAudio()">✦ Analyze Severity Score</button>
      </div>
    </div>

    <!-- Record Section -->
    <div id="record-section" class="input-section">
      <div class="grid-2">
        <div class="nv-card" style="text-align:center;">
          <p class="page-label" style="margin-bottom:10px;">Recording Controls</p>

          <!-- Timer display -->
          <div id="timer-display" style="font-family:var(--font-display); font-size:2.5rem; color:var(--purple-light); margin:1rem 0 0.5rem;">00:00</div>
          <p style="font-family:var(--font-body); font-size:0.8rem; color:var(--text-muted); margin-bottom:1.5rem;">Press record and speak as long as you need</p>

          <!-- Waveform animation -->
          <div id="waveform-anim" class="waveform-bar" style="display:none; margin-bottom:1.5rem;">
            ${Array.from({length:18}, (_,i) => `<span style="height:${8+Math.random()*30}px; animation-delay:${i*0.08}s;"></span>`).join('')}
          </div>

          <!-- Record button -->
          <div style="display:flex; gap:1rem; justify-content:center;">
            <button id="rec-btn" class="btn" style="max-width:180px; background:rgba(239,68,68,0.12); border-color:rgba(239,68,68,0.4); color:#f87171;"
              onclick="toggleRecording()">
              ⏺ Start Recording
            </button>
            <button id="stop-btn" class="btn" style="max-width:180px; display:none;" onclick="stopRecording()">
              ⏹ Stop
            </button>
          </div>

          <div id="rec-status" style="margin-top:1rem;"></div>
          <div id="record-preview" class="audio-preview" style="display:none; margin-top:1rem;"></div>
        </div>

        <div class="nv-card" style="display:flex; align-items:center; justify-content:center;">
          <div style="text-align:center; color:#6b7280; font-family:var(--font-body); font-size:0.88rem;">
            <div style="font-size:2rem; margin-bottom:0.75rem;">🎤</div>
            <p style="margin:0 0 0.5rem; color:var(--text-secondary); font-size:0.9rem;">Recording Tips</p>
            <ul style="text-align:left; margin-top:0.75rem; line-height:1.8; font-size:0.83rem;">
              <li>Allow microphone access when prompted</li>
              <li>Speak naturally and continuously</li>
              <li>Speak continuously and clearly</li>
              <li>Stop when the sample is sufficient</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="record-analyze-btn" style="text-align:center; margin-top:2rem; display:none;">
        <button class="btn-primary" onclick="analyzeAudio()">✦ Analyze Severity Score</button>
      </div>
    </div>
  `;
}

function showUpload() {
  document.getElementById('method-select').style.display = 'none';
  document.getElementById('upload-section').classList.add('active');
}

function showRecord() {
  document.getElementById('method-select').style.display = 'none';
  document.getElementById('record-section').classList.add('active');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').style.borderColor = '#374151';
  const file = e.dataTransfer.files[0];
  if (file) processUploadedFile(file);
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (file) processUploadedFile(file);
}

function processUploadedFile(file) {
  window._audioFile = file;
  const url = URL.createObjectURL(file);
  const preview = document.getElementById('upload-preview');
  preview.innerHTML = `
    <div style="margin-top:1rem;">
      <p style="font-family:var(--font-body); font-size:0.78rem; color:var(--text-muted); margin-bottom:6px;">📎 ${file.name}</p>
      <audio controls src="${url}" style="width:100%; border-radius:8px;"></audio>
    </div>
  `;
  preview.style.display = 'block';
  document.getElementById('upload-analyze-btn').style.display = 'block';
}

// ---- LIVE RECORDING ----
async function toggleRecording() {
  if (isRecording) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    isRecording = true;

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = finishRecording;
    mediaRecorder.start(100);

    // UI
    document.getElementById('rec-btn').style.display = 'none';
    document.getElementById('stop-btn').style.display = 'inline-block';
    document.getElementById('waveform-anim').style.display = 'flex';
    document.getElementById('rec-status').innerHTML = `
      <div class="recording-indicator"><span class="rec-dot"></span> Recording… speak naturally</div>
    `;

    // Timer
    let seconds = 0;
    recordingInterval = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      document.getElementById('timer-display').textContent = `${m}:${s}`;
    }, 1000);

  } catch (err) {
    document.getElementById('rec-status').innerHTML = `
      <div style="padding:0.75rem; border-radius:8px; background:rgba(239,68,68,0.08);
                  border:1px solid rgba(239,68,68,0.3); color:#f87171; font-family:var(--font-body); font-size:0.85rem;">
        ⚠ Microphone access denied. Please allow access in browser settings.
      </div>
    `;
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
    isRecording = false;
    clearInterval(recordingInterval);

    document.getElementById('stop-btn').style.display = 'none';
    document.getElementById('waveform-anim').style.display = 'none';
  }
}

function finishRecording() {
  const blob = new Blob(recordedChunks, { type: 'audio/webm' });
  window._audioFile = blob;
  const url = URL.createObjectURL(blob);

  document.getElementById('rec-status').innerHTML = `
    <div style="padding:0.75rem; border-radius:8px; background:rgba(16,185,129,0.08);
                border:1px solid rgba(16,185,129,0.3); color:#34d399; font-family:var(--font-body); font-size:0.85rem;">
      ✓ Recording complete
    </div>
  `;

  const preview = document.getElementById('record-preview');
  preview.innerHTML = `<audio controls src="${url}" style="width:100%; border-radius:8px; margin-top:0.5rem;"></audio>`;
  preview.style.display = 'block';

  document.getElementById('rec-btn').style.display = 'inline-block';
  document.getElementById('record-analyze-btn').style.display = 'block';
}

async function analyzeAudio() {
  if (!window._audioFile) {
    alert('Please upload or record an audio file first');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', window._audioFile);

    const response = await fetch('https://schizospeech.onrender.com', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      alert('Error: ' + result.error);
      return;
    }

    window._predictionScore = parseFloat(result.score.toFixed(1));
    navigateTo('results');
  } catch (error) {
    console.error('Prediction error:', error);
    alert('Failed to analyze audio: ' + error.message);
  }
}