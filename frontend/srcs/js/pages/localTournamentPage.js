import globalState from '../globalState.js';

export const localTournamentPage = {
  getHtml() {
    return `
    <div class="control-bar__title">Tournament</div>
    <div class="control-bar__alias-set">
      <input type="text" name="alias" required placeholder="${globalState.alias.player1}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player1Alias}'" autocomplete="off">
      <input type="text" name="alias" required placeholder="${globalState.alias.player2}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player2Alias}'" autocomplete="off">
      <input type="text" name="alias" required placeholder="${globalState.alias.player3}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player3Alias}'" autocomplete="off">
      <input type="text" name="alias" required placeholder="${globalState.alias.player4}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player4Alias}'" autocomplete="off">
    </div>
    <div class="control-bar__confirm">
      <button class="control-bar__confirm__btn--play">Play</button>
      <button class="control-bar__confirm__btn--cancel" data-link="mainPage">Cancel</button>
    </div>
  `;
  },
  css: 'styles/css/localTournament.css'
};