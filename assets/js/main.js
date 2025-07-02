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

// 全新主页脚本：动态时间戳、路径提示、主题切换、分享
function updateTimestamp() {
  const el = document.getElementById('timestamp');
  if (!el) return;
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const str = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  el.textContent = str;
}
setInterval(updateTimestamp, 1000);

document.addEventListener('DOMContentLoaded', function() {
  updateTimestamp();
  // 路径提示
  const pathMap = {
    'index.html': '王UI平的主页',
    'jsqrs.html': '确认书',
    'about.html': '关于',
    'contact.html': '联系'
  };
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const breadcrumb = document.getElementById('breadcrumb');
  if (breadcrumb && pathMap[path]) breadcrumb.textContent = pathMap[path];
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
  initTheme();
  document.getElementById('theme-toggle').onclick = toggleTheme;
  // 分享功能
  document.getElementById('share-btn').onclick = function() {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制，可手动分享');
    }
  };
  // 高亮当前导航
  const navLinks = document.querySelectorAll('.nav-btn');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
