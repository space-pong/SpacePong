//import './utils/renderPage.js';

import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
//const routes = {
//  login: loginPage
//}

function init() {
  renderControlBar(loginPage)
}

init();