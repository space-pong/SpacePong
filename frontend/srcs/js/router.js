import { renderControlBar} from './utils/renderControlBar.js';
import { loginPage } from './pages/loginPage.js'
import { mainPage } from './pages/mainPage.js'
import { unitSelectPage } from './pages/unitSelectPage.js'
import { localAIPage } from './pages/localAIPage.js'
import { pvpFillAliasPage } from './pages/pvpFillAliasPage.js'
import { remoteMatchPage }  from './pages/remoteMatchPage.js'
import { gamePage } from './pages/gamePage.js';
import { gameResultPage } from './pages/gameResultPage.js'
import { tournamentTablePage } from './pages/tournamentTablePage.js';
import { tournamentFillAliasPage }  from './pages/tournamentFillAliasPage.js'
import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState, { resetGlobalState } from './globalState.js';
import { renderLogin } from './utils/renderLogin.js';
import { otpPage } from './pages/otpPage.js';

export class Router {
  constructor() {
    this.routes = [
      {path: "/", view: mainPage},
      {path: "/login", view: loginPage},
      {path: "/otp", view: otpPage},
      {path: "/unitSelect", view: unitSelectPage},
      {path: "/localAI", view: localAIPage},
      {path: "/pvpFill", view: pvpFillAliasPage},
      {path: "/remoteMatch", view: remoteMatchPage},
      {path: "/game", view: gamePage},
      {path: "/gameResult", view: gameResultPage},
      {path: "/tournamentTable", view: tournamentTablePage},
      {path: "/tournamentFill", view: tournamentFillAliasPage},
    ];
    window.addEventListener('popstate', () => this.route());

    // this.route(); 
    // app.js init함수에서 불러오는게 맞을 것 같아서 주석처리하겠습니다. 

    document.body.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const path = e.target.getAttribute('href');
        const gameMode = e.target.getAttribute('game-mode');
        const data = e.target.getAttribute('data-link');
        if (gameMode) {
          globalState.gameMode = e.target.getAttribute('game-mode');
        }
        if (data && data == "auth42") {
          window.location.href = "auth42/login/";
          return ;
        }
        this.navigateTo(path);
      }
    });

  }


  async route() {
    let match = this.findMatch();
    if (!match) {
      document.querySelector('#app').innerHTML = `<h1>404</h1>`;
      return ;
    } else if (match == '/') {
      resetGlobalState();
    }
    await this.render(match);
  }

  findMatch() {
    return this.routes.map((route) => ({
      route,
      isMatch: location.pathname === route.path
    })).find((potentialMatch) => potentialMatch.isMatch);
  }

  async render (match) {
    const view = match.route.view;
    await renderControlBar(view);
  }

  async navigateTo(url) {
    history.pushState(globalState, null, url);
    await this.route();
  }
}