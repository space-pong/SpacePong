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
import { getData, postData, deleteData, checkOTP } from './utils/api.js'

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
    this.route = this.route.bind(this);

    window.addEventListener('popstate', (e) => {
      // remote 매치메이킹 화면 뒤로가기, 앞으로가기 로직
      if (globalState.gameMode === "remote" && globalState.step === 1) {
        deleteData("all");
      }
      
      Object.assign(globalState, e.state.save);
      this.route();
    });

    window.addEventListener('beforeunload', () => {
      history.replaceState({ save: globalState }, null, window.location.pathname);
    });

    window.addEventListener('load', (e) => {
      const state = window.history.state;
      if (state && state.save) {
        Object.assign(globalState, state.save);
      }
      // remote 매치메이킹 화면 새로고침 로직
      if (globalState.gameMode === "remote" && globalState.step === 1) {
        deleteData("all");
      }
      // Todo: remote 게임 화면 새로고침 로직
      if (globalState.gameMode === "remote" && globalState.step === 2) {
        // game 객체 및 리소스 잘 종료되는지 확인 필요
        this.navigateTo("/");
      }
    });

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

  async route(router) {
    if (window.location.pathname !== '/login' && 
        window.location.pathname !== '/otp' &&
        window.location.pathname !== '/' &&
        globalState.intraID === null) {
      resetGlobalState();
      window.location.pathname = '/login';
    }
    const hasOTP = await checkOTP();
    if (globalState.intraID !== null &&
      hasOTP === false) {
      resetGlobalState();
      window.location.pathname = '/login';
    }
    let match = this.findMatch();
    if (!match) {
      document.querySelector('#app').innerHTML = `<h1>404</h1>`;
      return ;
    } else if (match.route.path === '/') {
      globalState.intraID = localStorage.getItem('spacePongIntraID');
      resetGlobalState();
    }
    await this.render(match, this);
  }

  findMatch() {
    return this.routes.map((route) => ({
      route,
      isMatch: location.pathname === route.path
    })).find((potentialMatch) => potentialMatch.isMatch);
  }

  async render (match, router) {
    const view = match.route.view;
    await renderControlBar(view, router);
  }

  async navigateTo(url) {

    history.pushState({ save: globalState }, null, url);

    await this.route();
  }
}