import { PongGame } from "./Game/PongGame.js"

import { DualSenseController } from "./Game/Controller/DualSenseController.js";
import { AIController } from './Game/Controller/AIController.js';

document.getElementById('art').addEventListener('click', async function handler() {
  try {
    
    document.getElementById('art').removeEventListener('click', handler);
    console.log("he");
    // 1. 컨트롤러
    const dualSenseController = new DualSenseController(); // 듀얼센스 게임패드 컨트롤러
    await dualSenseController.init()
    
    dualSenseController.setSubKeyboard(37, 39, 38, 40, 32); // 보조 키보드 방향키 + 스페이스바
    const aiController = new AIController(); // AI로 작동되는 자동 컨트롤러

    // 2. 게임
    const game = new PongGame();
    await game.init(dualSenseController, aiController, "Zerg", "Zerg", 'art');
    await game.start();
    game.isEnd().then(() => {
      console.log("hello");
      game.renderer.dispose(); 
      document.getElementById('art').addEventListener('click', handler);
    });
    console.log("end");
  } catch (error) {
    console.error(error);
  }
});
