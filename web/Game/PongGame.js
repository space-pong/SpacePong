import { AIController } from "./Controller/AIController.js";
import { Controller } from "./Controller/Controller.js";
import { DualSenseController } from "./Controller/DualSenseController.js";
import { PongGameLogic } from "./PongGameLogic.js";
import { PongGameRenderer } from "./PongGameRenderer.js";


export class PongGame {
  constructor() {

  }

  async init (controller1, controller2, skin1, skin2, canvasId) {
    if (controller1 instanceof AIController) { // controller1에 AI 설정 불가
      return false;
    }

    if (controller2 instanceof DualSenseController) { // controller2에는 듀얼센스 컨트롤러 설정불가
      return false;
    }

    this.controller1 = controller1;
    this.controller2 = controller2;
    this.logic = new PongGameLogic(controller1, controller2);
    if (controller2 instanceof AIController) {
      controller2.linkGameLogic(this.logic);
    }
    this.renderer = new PongGameRenderer();
    await this.renderer.init(canvasId, this.logic, skin1, skin2);
  }

  start() {
    this.renderer.start();
    this.logic.start();
  }
}