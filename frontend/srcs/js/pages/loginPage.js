import { loadTranslation } from "../utils/translate.js";
// pages/loginPage.js

export const loginPage = {
  async getHtml() {
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
    }
    if (localStorage.getItem('spacePongIntraID')) {
      localStorage.removeItem('spacePongIntraID');
    }
    return `
    <button class="control-bar__login-btn" data-link="auth42">${await loadTranslation("Login")}</button>
    `;
  },
  css: 'styles/css/loginPage.css'
};
