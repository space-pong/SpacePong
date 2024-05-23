import { PongRenderer } from './Game/PongRenderer.js';
import { PongGameLogic } from './Game/PongGameLogic.js';
import { KeyboardController } from './Game/KeyboardController.js';


document.getElementById('art').addEventListener('click', async function handler() {
  try {
    document.getElementById('art').removeEventListener('click', handler);
    const keyboard1 = new KeyboardController(37, 39, 38, 40, 32); // 방향키 + 스페이스바
    const keyboard2 = new KeyboardController(65, 68, 87, 83, 70); // wasd + f
    const pongGameLogic = new PongGameLogic(keyboard1, keyboard2);
    const pongRenderer = new PongRenderer();
    await pongRenderer.init('art', pongGameLogic);
    pongRenderer.setTopView();
    pongRenderer.start();
    pongGameLogic.start();
  } catch (error) {
    console.error(error);
  }
});



