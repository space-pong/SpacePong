import globalState from "../globalState.js";

export const gameResultPage = {
  getHtml() {
    return `
    <p>${globalState.winner}</p>
    `;
  },
  css: 'styles/css/gameResultPage.css'
};