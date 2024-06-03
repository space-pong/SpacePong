import globalState from '../globalState.js';

export const localTournamentPage = {
  html: `
  <div class="control-bar__tournament">
  <header class="control-bar__tournament__header">Tournament</header>
  <div class="control-bar__tournament__alias-set">
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="${globalState.player1Alias}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player1Alias}'">
    </div>
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="${globalState.player2Alias}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player2Alias}'">
    </div>
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="${globalState.player3Alias}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player3Alias}'">
    </div>
    <div class="control-bar__tournament__alias-set__input">
      <input type="text" name="alias" required placeholder="${globalState.player4Alias}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player4Alias}'">
    </div>
  </div>
  <div class=control-bar__tournament__blank-box></div>
  <div class="control-bar__tournament__confirm">
    <button class="control-bar__tournament__confirm__btn--play">Play</button>
    <button class="control-bar__tournament__confirm__btn--cancel" data-link="mainPage">Cancel</button>
  </div>
</div>
  `,
  css: 'styles/css/localTournament.css'
};