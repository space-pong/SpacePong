/*
import { createLoginButton } from '../pages/loginPage.js';

let controlBar = document.querySelector('.control-bar');
let loginButton = createLoginButton();
controlBar.appendChild(loginButton);
*/

export function renderControlBar(page) {
  const target = document.querySelector('.control-bar');
  target.innerHTML = page.html;
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