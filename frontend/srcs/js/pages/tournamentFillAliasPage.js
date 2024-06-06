import globalState from '../globalState.js';

export const tournamentFillAliasPage = {
  getHtml() {
    return `
    <div class="control-bar__title">Tournament</div>
    <div class="control-bar__alias-set">
      <input type="text" name="alias" id="alias1" required placeholder="${globalState.alias.player1}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.alias.player1}'" autocomplete="off">
      <input type="text" name="alias" id="alias2" required placeholder="${globalState.alias.player2}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.alias.player2}'" autocomplete="off">
      <input type="text" name="alias" id="alias3" required placeholder="${globalState.alias.player3}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.alias.player3}'" autocomplete="off">
      <input type="text" name="alias" id="alias4" required placeholder="${globalState.alias.player4}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.alias.player4}'" autocomplete="off">
    </div>
    <div class="control-bar__confirm">
      <button class="control-bar__confirm__btn--play" data-link="dynamicPage">Play</button>
      <button class="control-bar__confirm__btn--cancel" data-link="mainPage">Cancel</button>
    </div>
  `;
  },
  css: 'styles/css/tournamentFillAliasPage.css'
};