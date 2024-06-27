import { loadTranslation } from "../utils/translate.js";
import { deletetoken } from "../utils/checkToken.js";
import { deleteOTP } from "../utils/api.js"
// pages/loginPage.js

export const loginPage = {
  async getHtml() {
    await deleteOTP();
    if (localStorage.getItem('accessToken')) {
      localStorage.removeItem('accessToken');
    }
    if (localStorage.getItem('spacePongIntraID')) {
      localStorage.removeItem('spacePongIntraID');
    }
    await deletetoken();
    return `
    <button class="control-bar__login-btn" data-link="auth42">${await loadTranslation("Login")}</button>
    `;
  },
  css: 'styles/css/loginPage.css'
};

