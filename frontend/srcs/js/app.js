//import './utils/renderPage.js';
import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState from './globalState.js';
import { renderLogin } from './utils/renderLogin.js';

import { Router } from './router.js';

async function init() {
  // let checkAccess = await checkaccess();
  // if (!checkAccess)
  // {
  //   console.log("!");
  //   await renderLogin();
  //   return ;
  // }

  const router = new Router();

  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken)
  {
    console.log("checkAccess false");
    await router.navigateTo("/login");
  }
}


/*const routes = {
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


window.addEventListener('DOMContentLoaded', init);

