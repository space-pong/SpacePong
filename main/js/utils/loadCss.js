// js/utils/loadCSS.js
export function loadCSS(cssPath) {
  const head = document.head;
  const link = document.createElement('link');

  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssPath;

  const existingLink = document.querySelector('link[data-dynamic-css]');
  if (existingLink) {
    head.removeChild(existingLink);
  }

  link.setAttribute('data-dynamic-css', 'true');
  head.appendChild(link);
}
