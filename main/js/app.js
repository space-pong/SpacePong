//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { remotePage } from './pages/remotePage.js'
import { localAIPage } from './pages/localAIPage.js'
import { localOneToOnePage } from './pages/localOneToOnePage.js'
import { localTournamentPage }  from './pages/localTournamentPage.js'
import { remoteMatchPage }  from './pages/remoteMatchPage.js'

const routes = {
  loginPage: loginPage,
  mainPage: mainPage,
  remotePage: remotePage,
  remoteMatchPage: remoteMatchPage,
  localAIPage: localAIPage,
  localOneToOnePage: localOneToOnePage,
  localTournamentPage: localTournamentPage
};
//routes에서 경로쓰는 방식으로 바꿔주기

function init() {
  //테스트위한 방법
  renderControlBar(loginPage);
  //renderControlBar(mainPage);
  //renderControlBar(remotePage);
  //renderControlBar(localAIPage);
  //renderControlBar(localOneToOnePage);
  //renderControlBar(localTournamentPage);

  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
        const page = e.target.getAttribute('data-link');
        renderControlBar(routes[page]);
        //history.pushState({ page }, '', page);
    }
});
}

//window.addEventListener('popstate', (event) => {
//  const page = event.state?.page || 'login';
//  renderControlBar(routes[page]);
//});


window.addEventListener('DOMContentLoaded', init);