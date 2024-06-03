// js/utils/renderControlBar.js
import { loadCSS } from './loadCss.js';
import globalState from '../globalState.js';

export function renderControlBar(page) {
  const target = document.querySelector('.control-bar');
  target.classList.remove('fade-in');
  target.classList.add('fade-out');
  target.addEventListener('animationend', function handleAnimationEnd() {
    target.classList.remove('fade-out');
    target.innerHTML = page.html;
    loadCSS(page.css);
    target.classList.add('fade-in');
    target.removeEventListener('animationend', handleAnimationEnd);
    if (globalState.target) {
      const selectButton = document.querySelector('.control-bar__confirm__btn--select');
      if (selectButton) {
        selectButton.setAttribute('data-link', globalState.target);
      }
    }
  });
}
