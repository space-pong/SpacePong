import globalState from "../globalState.js";
import { loadTranslation } from "../utils/translate.js";

export const gameResultPage = {
  async getHtml() {
    return `
    <div class="control-bar__title">${await loadTranslation("Winner")}</div>
    <div class="control-bar__type">${globalState.winner}</div>
    <div class="control-bar__confirm">
      <button href="" class="control-bar__confirm__btn--next" data-link>${await loadTranslation("Next")}</button>
    </div>
    `;
  },
  css: 'styles/css/gameResultPage.css'
};