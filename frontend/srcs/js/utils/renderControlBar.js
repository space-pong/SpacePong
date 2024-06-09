// js/utils/renderControlBar.js
import { loadCSS } from './loadCss.js';
import { KeyboardController } from '../game/Controller/KeyboardController.js'
import { AIController } from '../game/Controller/AIController.js'
import { PongGame } from '../game/PongGame.js'

import globalState from '../globalState.js';
import { gameResultPage } from '../pages/gameResultPage.js';

export async function renderControlBar(page) {
  console.log('page: ', page);
  console.log(globalState);
  const target = document.querySelector('.control-bar');
  target.classList.remove('fade-in');
  target.classList.add('fade-out');
  target.addEventListener('animationend', function handleAnimationEnd() {
    target.classList.remove('fade-out');
    target.innerHTML = page.getHtml();
    loadCSS(page.css);
    if (globalState.gameMode == "ai") {
      renderControlBarAI(page);
    } else if (globalState.gameMode == "tournament") {
      renderControlBarTournament(page);
    }
    target.classList.add('fade-in');
    target.removeEventListener('animationend', handleAnimationEnd);
  });
}

function renderControlBarTournament(page) {
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
    nextButton.setAttribute('data-link', "gamePage");
    nextButton.addEventListener('click', nextHandler);
    function nextHandler() {
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
    console.log("gasd");
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
    const aiController = new AIController(); // AI로 작동되는 자동 컨트롤러
    const game = new PongGame();
    await game.init(key1, aiController, globalState.unit.player1, "Zerg", "art");
    game.start();
    game.isEnd().then(() => {
      console.log("hello");
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


function resetGlobalState() {
  globalState.gameMode = null;
  globalState.step = 0;
  globalState.currentAlias = null;
  globalState.alias.player1 = globalState.intraID;
  globalState.alias.player2 = "guest1";
  globalState.alias.player3 = "guest2";
  globalState.alias.player4 = "guest3";
  globalState.unit.player1 = null;
  globalState.unit.player2 = null;
  globalState.unit.player3 = null;
  globalState.unit.player4 = null;
  globalState.tournament.groupAHome = null;
  globalState.tournament.groupAAway = null;
  globalState.tournament.groupBHome = null;
  globalState.tournament.groupBHome = null;
  globalState.tournament.finalHome = "n/a";
  globalState.tournament.finalAway = "n/a";
  globalState.winner = null;
}


