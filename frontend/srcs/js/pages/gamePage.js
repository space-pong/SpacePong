import globalState from "../globalState.js";

export const gamePage = {
  getHtml() {
    return `
    <div class="scoreboard">
      <div class="player1">
        <div class="player1-name">${globalState.currentAlias}</div>
        <div class="player1-score" id="player1-score">0</div>
      </div>
      <div class="player2">
        <div class="player2-name">${globalState.oppsiteAlias}</div>
        <div class="player2-score" id="player2-score">0</div>
      </div>
    </div>
    <div class="game-view" id='art'></div>
    `;
  },
  css: 'styles/css/gamePage.css'
};