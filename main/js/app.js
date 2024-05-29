//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { localOneToOnePage } from './pages/localOneToOnePage.js'
import { singleAIPage } from './pages/singleAIPage.js'
import { singleOneToOnePage } from './pages/singleOneToOnePage.js'
import { singleTournamentPage } from './pages/singleTournamentPage.js'
//const routes = {
//  login: loginPage
//}

function init() {
  //테스트위한 방법
  renderControlBar(loginPage);
  //renderControlBar(mainPage);
  //renderControlBar(localOneToOnePage);
  //renderControlBar(singleAIPage);
  //renderControlBar(singleOneToOnePage);
  //renderControlBar(singleTournamentPage);
}

init();