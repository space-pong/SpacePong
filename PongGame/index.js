import { PongRenderer } from './PongRenderer.js';
import { PongGame } from './PongGame.js';
import { KeyboardController } from './KeyboardController.js';

const keyboard1 = new KeyboardController(37, 39, 38, 40, 32); // 방향키 + 스페이스바
const keyboard2 = new KeyboardController(65, 68, 87, 83, 70); // wasd + f

const pongGame = new PongGame(keyboard1, keyboard2);

const pongRenderer = new PongRenderer();
await pongRenderer.init('art', pongGame);
//pongRenderer.setTopView();
pongRenderer.animate();
