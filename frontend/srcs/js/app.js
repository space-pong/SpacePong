//import './utils/renderPage.js';
import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState, { resetGlobalState } from './globalState.js'; 

import { Router } from './router.js';

async function handleLogin(router) {
  let isLoggedIn = await checkaccess();
  if (isLoggedIn && globalState.otp == true) {
    globalState.intraID = localStorage.getItem('spacePongIntraID');
  } else {
    await fetchTokens(router);
    isLoggedIn = await checkaccess();
    if (!isLoggedIn)
    {
      await router.navigateTo("/login");
    }
  }
}

async function init() {
  const router = new Router();
  await handleLogin(router);
  router.route(router);
}

window.addEventListener('DOMContentLoaded', init);

/* 이전 코드들
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
    renderControlBar(mainPage);
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
}*/

//window.addEventListener('popstate', (event) => {
//  const page = event.state?.page || 'login';
//  renderControlBar(routes[page]);
//});


