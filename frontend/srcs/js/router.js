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

export class Router {
  constructor() {
    this.routes = [
      {path: "/", view: mainPage},
      {path: "/login", view: loginPage},
      {path: "/unitSelect", view: unitSelectPage},
      {path: "/localAI", view: localAIPage},
      {path: "/localOneToOne", view: localOneToOnePage},
      {path: "/remoteMatch", view: remoteMatchPage},
      {path: "/game", view: gamePage},
      {path: "/gameResult", view: gameResultPage},
      {path: "/tournamentTable", view: tournamentTablePage},
      {path: "/tournamentFill", view: tournamentFillAliasPage},
    ];
    window.addEventListener('popstate', () => this.route());


    this.route();

    document.body.addEventListener('click', (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const path = e.target.getAttribute('href');
        const gameMode = e.target.getAttribute('game-mode');
        if (gameMode) {
          globalState.gameMode = e.target.getAttribute('game-mode');
        }
        this.navigateTo(path);
      }
    });

  }


  async route() {

    await fetchTokens();
    if (!localStorage.getItem('accessToken'))
    {
      console.log("here");
      renderControlBar(login);
      return ;
      // 나중에
    }
    
    let match = this.findMatch();
    if (!match) {
      console.log(match);
      document.querySelector('#app').innerHTML = `<h1>404</h1>`;
      return ;
    }
    console.log('match: ', match);
    await this.render(match);
  }

  findMatch() {
    console.log(location.pathname);
    return this.routes.map((route) => ({
      route,
      isMatch: location.pathname === route.path
    })).find((potentialMatch) => potentialMatch.isMatch);
  }

  async render (match) {
    const view = match.route.view;
    await renderControlBar(view);
  }

  navigateTo(url) {
    history.pushState(null, null, url);
    this.route();
    
  }
}