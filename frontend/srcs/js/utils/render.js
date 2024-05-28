//공통 렌더링 함수 및 유틸리티 함수들을 포함합니다.
export function renderPage(page) {
  const app = document.getElementById('app');
  app.innerHTML = page.html;
  loadCSS(page.css);
}

function loadCSS(cssPath) {
  const head = document.head;
  const link = document.createElement('link');

  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssPath;

  // Remove existing CSS
  const existingLink = document.querySelector('link[data-dynamic-css]');
  if (existingLink) {
      head.removeChild(existingLink);
  }

  link.setAttribute('data-dynamic-css', 'true');
  head.appendChild(link);
}