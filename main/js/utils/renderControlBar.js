/*
import { createLoginButton } from '../pages/loginPage.js';

let controlBar = document.querySelector('.control-bar');
let loginButton = createLoginButton();
controlBar.appendChild(loginButton);
*/

export function renderControlBar(page) {
  const target = document.querySelector('.control-bar');
  if (target) {
    target.innerHTML = page.html;
  } else {
    console.error('Target element #controlBar not found.');
  }
}