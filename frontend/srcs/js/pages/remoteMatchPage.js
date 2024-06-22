import { loadTranslation } from "../utils/translate.js";

export const remoteMatchPage = {
  async getHtml() {
    return `
    <div class="control-bar__remoteMatch__title">${await loadTranslation("Finding match")}</div>
    <div class="control-bar__remoteMatch__type">1 ${await loadTranslation("vs")} 1</div>
    <div class="control-bar__remoteMatch__icon">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">${await loadTranslation("Loading")}...</span>
      </div>
    </div>
    <div class="control-bar__remoteMatch__confirm">
      <button href="/unitSelect" class="control-bar__remoteMatch__confirm__btn--cancel" data-link data-target="remoteMatchPage">${await loadTranslation("Cancel")}</button>
    </div>
    `;
  },
  css: 'styles/css/remoteMatchPage.css'
};
