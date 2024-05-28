// js/utils/renderControlBar.js
import { loadCSS } from './loadCss.js';

export function renderControlBar(page) {
  const target = document.querySelector('.control-bar');
  target.innerHTML = page.html;
  loadCSS(page.css);
}
