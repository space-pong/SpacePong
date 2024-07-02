import globalState from '../globalState.js';
import { loadTranslation } from "../utils/translate.js";

export const pvpFillAliasPage = {
  async getHtml() {
    return `
    <div class="control-bar__title">1 ${await loadTranslation("vs")} 1</div>
    <div class="control-bar__alias-set">
      <input type="text" name="alias" id="alias1" required placeholder="${globalState.alias.player1}" onfocus="this.placeholder=''" onblur="this.placeholder="${globalState.alias.player1}" autocomplete="off">
      <input type="text" name="alias" id="alias2" required placeholder="${globalState.alias.player2}" onfocus="this.placeholder=''" onblur="this.placeholder="${globalState.alias.player2}" autocomplete="off">
    </div>
    <div class="control-bar__confirm">
      <button class="control-bar__confirm__btn--play" data-link>${await loadTranslation("Play")}</button>
      <button href="/" class="control-bar__confirm__btn--cancel" data-link>${await loadTranslation("Cancel")}</button>
    </div>
    `;
  },
  css: 'styles/css/pvpFillAliasPage.css'
};