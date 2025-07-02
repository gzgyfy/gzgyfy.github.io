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

// 分享平台配置
const sharePlatforms = [
  {
    name: '微信',
    icon: '<svg width="22" height="22" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#7BB32E"/><path d="M16.5 32.5c-4.5 0-8-2.7-8-6.5 0-3.8 3.5-6.5 8-6.5 4.5 0 8 2.7 8 6.5 0 3.8-3.5 6.5-8 6.5zm15-2c-3.5 0-6-2.1-6-5 0-2.9 2.5-5 6-5s6 2.1 6 5c0 2.9-2.5 5-6 5z" fill="#fff"/></svg>',
    url: '' // 微信需引导用户截图或用微信内置分享
  },
  {
    name: '抖音',
    icon: '<img src="https://lf3-cdn-tos.bytescm.com/obj/static/douyin_favicon.ico" width="22" height="22" style="vertical-align:middle;">',
    url: 'https://www.douyin.com/'
  },
  {
    name: '快手',
    icon: '<img src="https://www.kuaishou.com/favicon.ico" width="22" height="22" style="vertical-align:middle;">',
    url: 'https://www.kuaishou.com/'
  },
  {
    name: 'QQ',
    icon: '<img src="https://im.qq.com/favicon.ico" width="22" height="22" style="vertical-align:middle;">',
    url: 'https://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}'
  },
  {
    name: '今日头条',
    icon: '<img src="https://sf1-ttcdn-tos.pstatp.com/obj/ttfe/tt_favicon.ico" width="22" height="22" style="vertical-align:middle;">',
    url: 'https://www.toutiao.com/'
  },
  {
    name: '哔哩哔哩',
    icon: '<img src="https://www.bilibili.com/favicon.ico" width="22" height="22" style="vertical-align:middle;">',
    url: 'https://www.bilibili.com/'
  },
  {
    name: '百家号',
    icon: '<img src="https://baijiahao.baidu.com/favicon.ico" width="22" height="22" style="vertical-align:middle;">',
    url: 'https://baijiahao.baidu.com/'
  },
];

function showShareMenu() {
  let menu = document.getElementById('share-menu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'share-menu';
    menu.style.position = 'fixed';
    menu.style.top = '64px';
    menu.style.right = '24px';
    menu.style.background = 'var(--foreground)';
    menu.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
    menu.style.borderRadius = '10px';
    menu.style.padding = '10px 12px';
    menu.style.zIndex = '2000';
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.gap = '8px';
    menu.style.minWidth = '160px';
    menu.innerHTML = sharePlatforms.map(p =>
      `<button class="share-menu-btn" data-url="${p.url}" data-name="${p.name}" style="display:flex;align-items:center;gap:8px;font-size:15px;background:none;border:none;cursor:pointer;padding:6px 0;color:var(--text);">
        ${p.icon} <span>${p.name}</span>
      </button>`
    ).join('') +
    `<button class="share-menu-btn" data-name="系统分享" style="display:flex;align-items:center;gap:8px;font-size:15px;background:none;border:none;cursor:pointer;padding:6px 0;color:var(--text);">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> <span>系统分享/复制链接</span>
    </button>`;
    document.body.appendChild(menu);
    // 点击空白关闭
    setTimeout(()=>{
      document.addEventListener('click', hideShareMenu, { once: true });
    }, 100);
  }
  menu.style.display = 'flex';
  // 绑定事件
  menu.querySelectorAll('.share-menu-btn').forEach(btn => {
    btn.onclick = function(e) {
      e.stopPropagation();
      const name = btn.getAttribute('data-name');
      if (name === '系统分享') {
        if (navigator.share) {
          navigator.share({
            title: document.title,
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('链接已复制，可手动分享');
        }
      } else if (name === '微信') {
        alert('请使用微信自带浏览器或截图二维码进行分享');
      } else if (name === 'QQ') {
        const url = btn.getAttribute('data-url').replace('{url}', encodeURIComponent(window.location.href)).replace('{title}', encodeURIComponent(document.title));
        window.open(url, '_blank');
      } else {
        const url = btn.getAttribute('data-url');
        if (url && url.startsWith('http')) {
          window.open(url, '_blank');
        } else {
          alert('请在对应App内使用分享功能');
        }
      }
      hideShareMenu();
    };
  });
}
function hideShareMenu() {
  const menu = document.getElementById('share-menu');
  if (menu) menu.remove();
}

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
  document.getElementById('share-btn').onclick = function(e) {
    e.stopPropagation();
    showShareMenu();
  };
  // 高亮当前导航
  const navLinks = document.querySelectorAll('.nav-btn');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
});
