// 自动生成导航栏html按钮，支持昼夜主题切换
function getHtmlFiles() {
  // 只在本地或支持fetch目录API的服务器下有效
  // 这里用静态配置，实际部署可用Node脚本自动生成
  return [
    { name: '主页', file: 'index.html' },
    { name: '家属确认书', file: 'Confirmation_Letter.html' }
    // 可继续添加更多页面
  ];
}

function renderNav(current) {
  const nav = document.getElementById('nav');
  nav.innerHTML = '';
  getHtmlFiles().forEach(item => {
    if (item.file !== current) {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.textContent = item.name;
      btn.onclick = () => { window.location.href = item.file; };
      nav.appendChild(btn);
    }
  });
}

// 主题切换
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '🌙' : '☀️';
}
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'light' ? 'dark' : 'light');
}
function initTheme() {
  const saved = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
}

document.addEventListener('DOMContentLoaded', function() {
  // 判断当前页面
  const path = window.location.pathname;
  const current = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  renderNav(current);
  initTheme();
  document.getElementById('theme-toggle').onclick = toggleTheme;
  // 返回主页按钮
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn && current !== 'index.html') {
    homeBtn.style.display = 'inline-block';
    homeBtn.onclick = () => { window.location.href = 'index.html'; };
  }
});
