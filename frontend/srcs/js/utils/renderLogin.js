import { loginPage } from '../pages/loginPage.js';
import { fetchTokens } from './checkToken.js';
import { loadCSS } from './loadCss.js';

export async function renderLogin() {
    const target = document.querySelector('.control-bar');
    target.innerHTML = loginPage.getHtml();
    loadCSS(loginPage.css);

    document.body.addEventListener('click', (e) => {
        if (e.target.matches('[data-link]')) {
          e.preventDefault();
          window.location.href = 'auth42/login/'
        } 
      })
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = localStorage.getItem('accessToken');
    if (code && !token)
    {
        await fetchTokens();
    }
}