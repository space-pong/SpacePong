//공통 렌더링 함수 및 유틸리티 함수들을 포함합니다.
export function renderPage(page) {
  loadCSS(page.css);
  const app = document.getElementById('app');
  app.innerHTML = page.html;
  if (page.js && Array.isArray(page.js)) {
    loadScriptsSequentially(page.js).catch(error => {
        console.error('Error loading scripts:', error);
    })}
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

function loadScript(jsPath) {
  return new Promise((resolve, reject) => {
      const body = document.body;
      const script = document.createElement('script');

      script.type = 'module';
      script.src = jsPath;

      script.onload = resolve;
      script.onerror = reject;

      body.appendChild(script);
  });
}

function loadScriptsSequentially(scripts) {
  return scripts.reduce((promise, script) => {
      return promise.then(() => loadScript(script));
  }, Promise.resolve());
}