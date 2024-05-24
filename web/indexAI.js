import { PongRenderer } from './Game/PongRenderer.js';
import { PongGameLogic } from './Game/PongGameLogic.js';
import { DualSenseController } from "./Game/Controller/DualSenseController.js";
import { AIController } from './Game/Controller/AIController.js';

document.getElementById('art').addEventListener('click', async function handler() {
  try {
    document.getElementById('art').removeEventListener('click', handler);

    const dualSenseController = new DualSenseController();
    await dualSenseController.init()
    dualSenseController.setSubKeyboard(37, 39, 38, 40, 32);
    const aiController = new AIController();
    const pongGameLogic = new PongGameLogic(dualSenseController, aiController);
    aiController.linkGameLogic(pongGameLogic);
    const pongRenderer = new PongRenderer();
    await pongRenderer.init('art', pongGameLogic, "Zerg", "Zerg");
    pongRenderer.start();
    pongGameLogic.start();
  } catch (error) {
    console.error(error);
  }
});
