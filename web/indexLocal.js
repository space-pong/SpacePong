import { PongGame } from "./Game/PongGame.js"
import { KeyboardController } from './Game/Controller/KeyboardController.js';


document.getElementById('art').addEventListener('click', async function handler() {
  try {
    document.getElementById('art').removeEventListener('click', handler);

    // 1. 컨트롤러
    const keyboard1 = new KeyboardController(37, 39, 38, 40, 32); // 방향키 + 스페이스바
    const keyboard2 = new KeyboardController(65, 68, 87, 83, 70); // wasd + f

    // 2. 게임
    const game = new PongGame();
    await game.init(keyboard1, keyboard2, "Default", "Zerg", 'art');
    game.renderer.setTopView();
    game.start();

  } catch (error) {
    console.error(error);
  }
});