//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { unitSelectPage } from './pages/unitSelectPage.js'
import { localAIPage } from './pages/localAIPage.js'
import { localOneToOnePage } from './pages/localOneToOnePage.js'
import { remoteMatchPage }  from './pages/remoteMatchPage.js'
import { gamePage } from './pages/gamePage.js';
import { gameResultPage } from './pages/gameResultPage.js'
import { tournamentTablePage } from './pages/tournamentTablePage.js';
import { tournamentFillAliasPage }  from './pages/tournamentFillAliasPage.js'

import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState from './globalState.js';

const routes = {
  loginPage: loginPage,
  mainPage: mainPage,
  unitSelectPage: unitSelectPage,
  remoteMatchPage: remoteMatchPage,
  localAIPage: localAIPage,
  localOneToOnePage: localOneToOnePage,
  tournamentFillAliasPage: tournamentFillAliasPage,
  gamePage: gamePage,
  gameResultPage: gameResultPage,
  tournamentTablePage: tournamentTablePage
};

async function init() {
  await fetchTokens();
  if (!localStorage.getItem('accessToken')){
    renderControlBar(loginPage);
  }
  else {
    renderControlBar(mainPage);
  }
  globalState.intraID = "jeekpark";
  globalState.alias.player1 = globalState.intraID;
  globalState.currentAlias = globalState.intraID;

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      const page = e.target.getAttribute('data-link');
      const gameMode = e.target.getAttribute('game-mode');
      if (gameMode) {
        globalState.gameMode = gameMode;
      }
      if (page == "auth42") {
        window.location.href = 'auth42/login/';
      }
      else {
        renderControlBar(routes[page]);
      }
        //history.pushState({ page }, '', page);
    }
  });
}

//window.addEventListener('popstate', (event) => {
//  const page = event.state?.page || 'login';
//  renderControlBar(routes[page]);
//});


window.addEventListener('DOMContentLoaded', init);