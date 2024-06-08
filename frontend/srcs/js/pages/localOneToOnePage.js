import globalState from '../globalState.js';

export const localOneToOnePage = {
  getHtml() {
    return `
    <div class="control-bar__title">1 vs 1</div>
    <div class="control-bar__alias-set">
      <input type="text" name="alias" required placeholder="${globalState.alias.player1}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player1Alias}'" autocomplete="off">
      <input type="text" name="alias" required placeholder="${globalState.alias.player2}" onfocus="this.placeholder=''" onblur="this.placeholder='${globalState.player2Alias}'" autocomplete="off">
    </div>
    <div class="control-bar__confirm">
      <button class="control-bar__confirm__btn--play">Play</button>
      <button href="/" class="control-bar__confirm__btn--cancel" data-link>Cancel</button>
    </div>
    `;
  },
  css: 'styles/css/localOneToOne.css'
};