//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { localOneToOnePage } from './pages/localOneToOnePage.js'
import { singleAIPage } from './pages/singleAIPage.js'
import { singleOneToOnePage } from './pages/singleOneToOnePage.js'
import { singleTournamentPage } from './pages/singleTournamentPage.js'

const routes = {
  loginPage: loginPage,
  mainPage: mainPage,
};

function init() {
  //테스트위한 방법
  renderControlBar(loginPage);
  //renderControlBar(mainPage);
  //renderControlBar(localOneToOnePage);
  //renderControlBar(singleAIPage);
  //renderControlBar(singleOneToOnePage);
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

//깜빡임이 너무 심함;; 왜그렇지?