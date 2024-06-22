// js/utils/renderControlBar.js
import { loadCSS } from './loadCss.js';
import { KeyboardController } from '../game/Controller/KeyboardController.js'
import { AIController } from '../game/Controller/AIController.js'
import { PongGame } from '../game/PongGame.js'
import globalState, { resetGlobalState } from '../globalState.js';
import { mainPage } from '../pages/mainPage.js';
import { gamePage } from '../pages/gamePage.js';
import { gameResultPage } from '../pages/gameResultPage.js';
import { tournamentTablePage } from '../pages/tournamentTablePage.js'
import { getData, postData, deleteData } from './api.js'
import { checkaccess, fetchTokens } from './checkToken.js';
import { otpPage } from '../pages/otpPage.js';
import { otpUtil } from './otpUtil.js';

export async function renderControlBar(page, router) {
  const target = document.querySelector('.control-bar');
  const renderedHTML = await page.getHtml();
  target.classList.remove('fade-in');
  target.classList.add('fade-out');
  target.addEventListener('animationend', function handleAnimationEnd() {
    target.classList.remove('fade-out');
    target.innerHTML = renderedHTML;
    loadCSS(page.css);

    if (page  == otpPage) {
      otpUtil(router);
    }
    if (globalState.gameMode == "ai") {
      renderControlBarAI(page);
    } else if (globalState.gameMode == "tournament") {
      renderControlBarTournament(page);
    } else if (globalState.gameMode == "pvp") {
      renderControlBarPvp(page);
    } else if (globalState.gameMode == "remote") {
      renderControlBarRemote(page);
    }
    target.classList.add('fade-in');
    target.removeEventListener('animationend', handleAnimationEnd);
  });
}


async function renderControlBarPvp(page) {
  if (globalState.step == 0) {
    const playButton = document.querySelector('.control-bar__confirm__btn--play');
    playButton.setAttribute('href', "/unitSelect");
    playButton.addEventListener('click', playHandler);
    function playHandler() {
      for (let i = 1; i <= 2; ++i) {
        let aliasInput = document.getElementById(`alias${i}`);
        if (aliasInput.value !== "") {
          globalState.alias[`player${i}`] = aliasInput.value;
        }
      }
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player1;
      playButton.removeEventListener('click', playHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler)
    function cancelHandler() {
      resetGlobalState();
      playButton.removeEventListener('click', playHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 1) {
    const selectButton = document.querySelector('.control-bar__confirm__btn--select');
    selectButton.setAttribute('href', './unitSelect');
    selectButton.addEventListener('click', selectHandler);
    function selectHandler() {
      const selectedUnit = document.querySelector('input[name="unit"]:checked');
      globalState.unit.player1 = selectedUnit.value;
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player2;
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);

    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler);
    cancelButton.setAttribute('data-link', "mainPage");
    function cancelHandler() {
      resetGlobalState();
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 2) {
    const selectButton = document.querySelector('.control-bar__confirm__btn--select');
    selectButton.setAttribute('href', './game');
    selectButton.addEventListener('click', selectHandler);
    function selectHandler() {
      const selectedUnit = document.querySelector('input[name="unit"]:checked');
      globalState.unit.player2 = selectedUnit.value;
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player1;
      globalState.oppsiteAlias = globalState.alias.player2;
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler);
    cancelButton.setAttribute('data-link', "mainPage");
    function cancelHandler() {
      resetGlobalState();
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 3) {
    const key1 = new KeyboardController(37, 39, 38, 40, 32);
    const key2 = new KeyboardController(65, 68, 87, 83, 70);
    const game = new PongGame();
    await game.init(key1, key2, globalState.unit.player1, globalState.unit.player2, "art");
    game.renderer.setTopView();
    game.logic.setScoreID('.player1-score', '.player2-score');
    game.start();
    game.isEnd().then(() => {
      game.renderer.dispose();
      ++globalState.step;
      if (game.logic.winner == "1") {
        globalState.winner = globalState.alias.player1;
      } else {
        globalState.winner = globalState.alias.player2;
      }
      renderControlBar(gameResultPage);
    });
  } else if (globalState.step == 4) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.addEventListener('click', nextHandler);
    nextButton.setAttribute('href', "/");
    function nextHandler() {
      resetGlobalState();
      nextButton.removeEventListener('click', nextHandler);
    }
  }
}

async function renderControlBarTournament(page) {
  if (globalState.step == 0) {
    const playButton = document.querySelector('.control-bar__confirm__btn--play');
    playButton.setAttribute('href', "/unitSelect");
    playButton.addEventListener('click', playHandler);
    function playHandler() {
      for (let i = 1; i <= 4; ++i) {
        let aliasInput = document.getElementById(`alias${i}`);
        if (aliasInput.value !== "") {
          globalState.alias[`player${i}`] = aliasInput.value;
        }
      }
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player1;
      playButton.removeEventListener('click', playHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler)
    function cancelHandler() {
      resetGlobalState();
      playButton.removeEventListener('click', playHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 1) {
    setupSelectButton(1, "/unitSelect", globalState.alias.player2);
  } else if (globalState.step == 2) {
    setupSelectButton(2, "/unitSelect", globalState.alias.player3);
  } else if (globalState.step == 3) {
    setupSelectButton(3, "/unitSelect", globalState.alias.player4);
  } else if (globalState.step == 4) {
    setupSelectButton(4, "/tournamentTable");
  } else if (globalState.step == 5) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.setAttribute('href', "/game");
    nextButton.addEventListener('click', nextHandler);
    function nextHandler() {
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player1;
      globalState.oppsiteAlias = globalState.alias.player2;
      nextButton.removeEventListener('click', nextButton);
    }
  } else if (globalState.step == 6) {
    const key1 = new KeyboardController(37, 39, 38, 40, 32);
    const key2 = new KeyboardController(65, 68, 87, 83, 70);
    const game = new PongGame();
    await game.init(key1, key2, globalState.unit.player1, globalState.unit.player2, "art");
    game.renderer.setTopView();
    game.logic.setScoreID('.player1-score', '.player2-score');
    game.start();
    game.isEnd().then(() => {
      game.renderer.dispose();
      ++globalState.step;
      if (game.logic.winner == "1") {
        globalState.tournament.finalHome = 1;
      } else {
        globalState.tournament.finalHome = 2;
      }
      renderControlBar(tournamentTablePage);
    });
  } else if (globalState.step  == 7) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.setAttribute('href', "/game");
    nextButton.addEventListener('click', nextHandler);
    function nextHandler() {
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player3;
      globalState.oppsiteAlias = globalState.alias.player4;
      nextButton.removeEventListener('click', nextButton);
    }
  } else if (globalState.step == 8) {
    const key1 = new KeyboardController(37, 39, 38, 40, 32);
    const key2 = new KeyboardController(65, 68, 87, 83, 70);
    const game = new PongGame();
    await game.init(key1, key2, globalState.unit.player3, globalState.unit.player4, "art");
    game.renderer.setTopView();
    game.logic.setScoreID('.player1-score', '.player2-score');
    game.start();
    game.isEnd().then(() => {
      game.renderer.dispose();
      ++globalState.step;
      if (game.logic.winner == "1") {
        globalState.tournament.finalAway = 3;
      } else {
        globalState.tournament.finalAway = 4;
      }
      renderControlBar(tournamentTablePage);
    });
  } else if (globalState.step == 9) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.setAttribute('href', "/game");
    nextButton.addEventListener('click', nextHandler);
    function nextHandler() {
      ++globalState.step;
      globalState.currentAlias = globalState.alias[`player${globalState.tournament.finalHome}`];
      globalState.oppsiteAlias = globalState.alias[`player${globalState.tournament.finalAway}`];
      nextButton.removeEventListener('click', nextButton);
    }
  } else if (globalState.step == 10) {
    const key1 = new KeyboardController(37, 39, 38, 40, 32);
    const key2 = new KeyboardController(65, 68, 87, 83, 70);
    const game = new PongGame();
    await game.init(key1, key2, globalState.unit[`player${globalState.tournament.finalHome}`], globalState.unit[`player${globalState.tournament.finalAway}`], "art");
    game.renderer.setTopView();
    game.logic.setScoreID('.player1-score', '.player2-score');
    game.start();
    game.isEnd().then(() => {
      game.renderer.dispose();
      ++globalState.step;
      if (game.logic.winner == "1") {
        globalState.winner = globalState.alias[`player${globalState.tournament.finalHome}`];
      } else {
        globalState.winner = globalState.alias[`player${globalState.tournament.finalAway}`];
      }
      renderControlBar(gameResultPage);
    });
  } else if (globalState.step == 11) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.addEventListener('click', nextHandler);
    nextButton.setAttribute('href', "/");
    function nextHandler() {
      resetGlobalState();
      nextButton.removeEventListener('click', nextHandler);
    }
  }

  function setupSelectButton(step, nextPath, nextAlias) {
    const selectButton = document.querySelector('.control-bar__confirm__btn--select');
    selectButton.setAttribute('href', nextPath);
    selectButton.addEventListener('click', selectHandler);
    function selectHandler() {
      const selectedUnit = document.querySelector('input[name="unit"]:checked');
      globalState.unit[`player${step}`] = selectedUnit.value;
      ++globalState.step;
      if (nextAlias) {
        globalState.currentAlias = nextAlias;
      }
      if (step === 4) {
        globalState.tournament.groupAHome = globalState.alias.player1;
        globalState.tournament.groupAAway = globalState.alias.player2;
        globalState.tournament.groupBHome = globalState.alias.player3;
        globalState.tournament.groupBAway = globalState.alias.player4;
      }
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler);
    cancelButton.setAttribute('data-link', "mainPage");
    function cancelHandler() {
      resetGlobalState();
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  }
}


async function renderControlBarAI(page) {
  if (globalState.step == 0) {
    globalState.oppsiteAlias = "AI";
    const selectButton = document.querySelector('.control-bar__confirm__btn--select');
    selectButton.setAttribute('href', "/localAI");
    selectButton.addEventListener('click', selectHandler);
    function selectHandler() {
      const selectedUnit = document.querySelector('input[name="unit"]:checked');
      globalState.unit.player1 = selectedUnit.value;
      globalState.step++;
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler)
    function cancelHandler() {
      resetGlobalState();
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 1) {
    const playButton = document.querySelector('.control-bar__confirm__btn--play');
    playButton.addEventListener('click', playHandler);
    function playHandler() {
      globalState.step++;
      playButton.removeEventListener('click', playHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler);
    function cancelHandler() {
      globalState.step--;
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 2) {
    var key1 = new KeyboardController(37, 39, 38, 40, 32);
    const aiController = new AIController();
    const game = new PongGame();
    await game.init(key1, aiController, globalState.unit.player1, "Zerg", "art");
    game.logic.setScoreID('.player1-score', '.player2-score');
    game.start();
    game.isEnd().then(() => {
      game.renderer.dispose(); 
      ++globalState.step;
      if (game.logic.winner == "1") {
        globalState.winner = globalState.alias.player1;
      } else {
        globalState.winner = "AI";
      }
      renderControlBar(gameResultPage);
    });
  } else if (globalState.step == 3) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.addEventListener('click', nextHandler);
    nextButton.setAttribute('href', "/");
    function nextHandler() {
      resetGlobalState();
      nextButton.removeEventListener('click', nextHandler);
    }
  }
}

async function renderControlBarRemote(page) {
  if (globalState.step == 0) {
    /* unitSelectPage */
    const selectButton = document.querySelector('.control-bar__confirm__btn--select');
    selectButton.setAttribute('href', '/remoteMatch');
    selectButton.addEventListener('click', selectHandler);
    function selectHandler() {
      const selectedUnit = document.querySelector('input[name="unit"]:checked');
      globalState.unit.player1 = selectedUnit.value;
      ++globalState.step;
      globalState.currentAlias = globalState.alias.player1;
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler);
    function cancelHandler() {
      resetGlobalState();
      selectButton.removeEventListener('click', selectHandler);
      cancelButton.removeEventListener('click', cancelHandler);
    }
  } else if (globalState.step == 1) {
    /* remoteMatchPage */
    const cancelButton = document.querySelector('.control-bar__remoteMatch__confirm__btn--cancel');
    let cancelClicked = false;
    if (cancelButton){
      cancelButton.addEventListener('click', cancelHandler);
      cancelButton.setAttribute('href', "/unitSelect");
    }
    function cancelHandler() {
      cancelClicked = true;
      deleteData("all");
      --globalState.step;
      cancelButton.removeEventListener('click', cancelHandler);
    }
    // 매치메이킹 요청
    await postData(globalState.unit.player1);
    // 매치메이킹 응답 받기 (polling)
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    let data = await getData();
    while (data[0].oppositeName.length === 0 && !cancelClicked){
      data = await getData();
      if (data.length === 0) {
        return;
      }
      await sleep(1000); // 1초 마다 polling
    }
    // 매치 상대와 게임 시작
    if (!cancelClicked)
    {
      ++globalState.step;
      globalState.oppsiteAlias = data[0].oppositeName;
      globalState.unit.player2 = data[0].oppositeSkin;
      globalState.roomNumber = data[0].RoomNumber;
      globalState.hostName = data[0].hostName;
      globalState.guestName = data[0].guestName;
      await deleteData("myName");
      renderControlBar(gamePage);
    }
  } else if (globalState.step == 2) {
    const key1 = new KeyboardController(37, 39, 38, 40, 32);
    const key2 = new KeyboardController(65, 68, 87, 83, 70);
    const game = new PongGame();
    await game.init(key1, key2, globalState.unit.player1, globalState.unit.player2, "art");
    game.logic.setScoreID('.player1-score', '.player2-score');
    if (globalState.hostName === globalState.currentAlias){
      game.logic.setHost(globalState.roomNumber);
    }
    else {
      game.logic.setGuest(globalState.roomNumber);
    }
    game.start();
    game.isEnd().then(() => {
      game.renderer.dispose();
      ++globalState.step;
      if (game.logic.winner == "1") {
        globalState.winner = globalState.currentAlias;
      } else {
        globalState.winner = globalState.oppsiteAlias;
      }
      renderControlBar(gameResultPage);
    });
  } else if (globalState.step == 3) {
    const nextButton = document.querySelector('.control-bar__confirm__btn--next');
    nextButton.addEventListener('click', nextHandler);
    nextButton.setAttribute('href', "/");
    function nextHandler() {
      renderControlBar(mainPage);
      resetGlobalState();
      nextButton.removeEventListener('click', nextHandler);
    }
  }
}
