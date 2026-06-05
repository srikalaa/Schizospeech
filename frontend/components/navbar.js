// components/navbar.js
function initNavbar() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.page);
    });
  });
}

function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');

  const btn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (btn) btn.classList.add('active');

  // Render page content
  if (pageId === 'home')     renderHome();
  if (pageId === 'analysis') renderAnalysis();
  if (pageId === 'results')  renderResults();
  if (pageId === 'support')  renderSupport();
  if (pageId === 'chat')     renderChat();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}