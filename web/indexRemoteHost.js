import { PongRenderer } from './Game/PongRenderer.js';
import { PongGameLogic } from './Game/PongGameLogic.js';
import { KeyboardController } from './Game/KeyboardController.js';
import { Controller } from './Game/Controller/Controller.js';


document.getElementById('art').addEventListener('click', async function handler() {
  try {
    document.getElementById('art').removeEventListener('click', handler);

    const hostKeyboard = new KeyboardController(37, 39, 38, 40, 32);
    const guestKeyboard = new Controller();

    const pongGameLogic = new PongGameLogic(hostKeyboard, guestKeyboard);
    pongGameLogic.setRemoteGuest();
    const pongRenderer = new PongRenderer();
    await pongRenderer.init('art', pongGameLogic, "Zerg", "Zerg");
    pongRenderer.setTopView();
    pongRenderer.start();
    pongGameLogic.start();
  } catch (error) {
    console.error(error);
  }
});



