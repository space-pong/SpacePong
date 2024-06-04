//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { unitSelectPage } from './pages/unitSelectPage.js'
import { localAIPage } from './pages/localAIPage.js'
import { localOneToOnePage } from './pages/localOneToOnePage.js'
import { localTournamentPage }  from './pages/localTournamentPage.js'
import { remoteMatchPage }  from './pages/remoteMatchPage.js'
import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState from './globalState.js';

const routes = {
  loginPage: loginPage,
  mainPage: mainPage,
  unitSelectPage: unitSelectPage,
  remoteMatchPage: remoteMatchPage,
  localAIPage: localAIPage,
  localOneToOnePage: localOneToOnePage,
  localTournamentPage: localTournamentPage
};
//routes에서 경로쓰는 방식으로 바꿔주기

async function init() {
  await fetchTokens();
  if (!localStorage.getItem('accessToken')){
    renderControlBar(loginPage);
  }
  else {
    renderControlBar(mainPage);
  }

  globalState.currentAlias = globalState.intraID;
  globalState.player1Alias = globalState.intraID;

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      const page = e.target.getAttribute('data-link');
      globalState.target = e.target.getAttribute('data-target');
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