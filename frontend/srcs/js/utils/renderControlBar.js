// js/utils/renderControlBar.js
import { loadCSS } from './loadCss.js';
import { KeyboardController } from '../game/Controller/KeyboardController.js'
import { AIController } from '../game/Controller/AIController.js'
import { PongGame } from '../game/PongGame.js'

import globalState from '../globalState.js';
export async function renderControlBar(page) {
  console.log(globalState);
  const target = document.querySelector('.control-bar');
  target.innerHTML = page.getHtml();
  loadCSS(page.css);

  if (globalState.gameMode == "ai") {
    await renderControlBarAI(page);
  } else if (globalState.gameMode == "remote") {

  }
}

async function renderControlBarAI(page) {
  if (globalState.step == 0) {
    const selectButton = document.querySelector('.control-bar__confirm__btn--select');
    selectButton.setAttribute('data-link', "localAIPage");
    selectButton.addEventListener('click', selectHandler);
    function selectHandler() {
      const selectedUnit = document.querySelector('input[name="unit"]:checked');
      globalState.player1Unit = selectedUnit.value;
      globalState.step++;
      selectButton.removeEventListener('click', selectHandler);
    }
    const cancelButton = document.querySelector('.control-bar__confirm__btn--cancel');
    cancelButton.addEventListener('click', cancelHandler)
    function cancelHandler() {
      globalState.gameMode = null;
      globalState.player1Unit = null;
      globalState.step = 0;
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
    await game.init(key1, aiController, globalState.player1Unit, "Zerg", "art");
    game.start();
  } else if (globalState.step == 3) {
    // 결과
  }
}





/* // js/utils/renderControlBar.js
import { loadCSS } from './loadCss.js';
import globalState from '../globalState.js';

export function renderControlBar(page) {
  const target = document.querySelector('.control-bar');
  target.classList.remove('fade-in');
  target.classList.add('fade-out');
  target.addEventListener('animationend', function handleAnimationEnd() {
    target.classList.remove('fade-out');
    target.innerHTML = page.getHtml();
    loadCSS(page.css);
    target.classList.add('fade-in');
    target.removeEventListener('animationend', handleAnimationEnd);
    if (globalState.target) {
      const selectButton = document.querySelector('.control-bar__confirm__btn--select');
      if (selectButton) {
        selectButton.setAttribute('data-link', globalState.target);
      }
    }
  });
} */

