import globalState from '../globalState.js';
import { loadTranslation } from "../utils/translate.js";

export const tournamentFillAliasPage = {
  async getHtml() {
    return `
    <div class="control-bar__title">${await loadTranslation("Tournament")}</div>
    <div class="control-bar__alias-set">
      <input type="text" name="alias" id="alias1" required placeholder="${await loadTranslation(globalState.alias.player1)}" onfocus="this.placeholder=''" onblur="this.placeholder='${await loadTranslation(globalState.alias.player1)}'" autocomplete="off">
      <input type="text" name="alias" id="alias2" required placeholder="${await loadTranslation(globalState.alias.player2)}" onfocus="this.placeholder=''" onblur="this.placeholder='${await loadTranslation(globalState.alias.player2)}'" autocomplete="off">
      <input type="text" name="alias" id="alias3" required placeholder="${await loadTranslation(globalState.alias.player3)}" onfocus="this.placeholder=''" onblur="this.placeholder='${await loadTranslation(globalState.alias.player3)}'" autocomplete="off">
      <input type="text" name="alias" id="alias4" required placeholder="${await loadTranslation(globalState.alias.player4)}" onfocus="this.placeholder=''" onblur="this.placeholder='${await loadTranslation(globalState.alias.player4)}'" autocomplete="off">
    </div>
    <div class="control-bar__confirm">
      <button class="control-bar__confirm__btn--play" data-link="dynamicPage">${await loadTranslation("Play")}</button>
      <button href="/" class="control-bar__confirm__btn--cancel" data-link>${await loadTranslation("Cancel")}</button>
    </div>
  `;
  },
  css: 'styles/css/tournamentFillAliasPage.css'
};
