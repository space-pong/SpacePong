//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { remotePage } from './pages/remotePage.js'
import { singleAIPage } from './pages/singleAIPage.js'
import { localOneToOnePage } from './pages/localOneToOnePage.js'
import { singleTournamentPage }  from './pages/singleTournamentPage.js'

const routes = {
  loginPage: loginPage,
  mainPage: mainPage,
  remotePage: remotePage,
  singleAIPage: singleAIPage,
  localOneToOnePage: localOneToOnePage,
  singleTournamentPage: singleTournamentPage
};
//routes에서 경로쓰는 방식으로 바꿔주기

function init() {
  //테스트위한 방법
  //renderControlBar(loginPage);
  //renderControlBar(mainPage);
  //renderControlBar(remotePage);
  //renderControlBar(singleAIPage);
  renderControlBar(localOneToOnePage);
  //renderControlBar(singleTournamentPage);

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