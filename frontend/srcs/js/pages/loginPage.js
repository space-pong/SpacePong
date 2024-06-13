// pages/loginPage.js

export const loginPage = {
  getHtml() {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
    }
    if (localStorage.getItem('spacePongIntraID')) {
      localStorage.removeItem('spacePongIntraID');
    }
    return `
    <button class="control-bar__login-btn" data-link="auth42">Login</button>
    `;
  },
  css: 'styles/css/loginPage.css'
};
