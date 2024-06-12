//import './utils/renderPage.js';
import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState from './globalState.js';
import { renderLogin } from './utils/renderLogin.js';

import { Router } from './router.js';

// async function handleLogin(e) {
//   e.preventDefault();
//   console.log("I'm here!");
//   const data = e.target.getAttribute('data-link');
//   console.log("data: ", data);
//   if (data == "auth42") {
//     console.log("I'm here2!");
//     window.location.href = 'auth42/login/';
//   }
// }

// export async function isLoggedIn(router) {
//   const accessToken = localStorage.getItem('accessToken');
//   console.log("checkaccess: ", checkaccess());
//   if (!accessToken && !checkaccess())
//   {
//     console.log("checkAccess false");
//     document.body.addEventListener('click', async (e)=> {
//       if (e.target.matches('[data-link]')) {
//         await handleLogin(e);
//       }
//     }
//     )
//     await router.navigateTo("/login");
//     await fetchTokens();
//   }
// }

async function handleLogin(router) {
  let isLoggedIn = await checkaccess();
  console.log("checkaccess: ", isLoggedIn);
  if (isLoggedIn) {
    router.navigateTo("/"); // 메인 페이지로 이동
  } else {
    // 로그인 페이지로 이동
    await fetchTokens();
    await router.navigateTo("/login");
    isLoggedIn = await checkaccess();
  }
}

async function init() {

  const router = new Router();

  await handleLogin(router);
  let isLoggedIn = await checkaccess();
  console.log("isLoggedIn: ", isLoggedIn)
  await router.route();
  // const accessToken = localStorage.getItem('accessToken');
  // if (!accessToken)
  // {
  //   console.log("checkAccess false");
  //   await router.navigateTo("/login");
  //   await fetchTokens();
  //   document.body.addEventListener('click', async (e)=> {
  //     if (e.target.matches('[data-link]')) {
  //       await handleLogin(e);
  //     }
  //   }
  //   )
  // }
}

window.addEventListener('DOMContentLoaded', init);
//1. 어세스토큰이 없으면 login페이지로 이동시키기 -> 2. 이벤트리스너달아서 login버튼 클릭했을때 fetchtoken으로 -> 홈페이지연결 -> 로그인 후 리다이렉션 메인페이지로하기 fetchtoken내용이 뭔지 잘 알아보기 그후 2fa 페이지 만들어서 거기로 연결하기 

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


