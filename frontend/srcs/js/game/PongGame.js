import { AIController } from "./Controller/AIController.js";
import { Controller } from "./Controller/Controller.js";
import { DualSenseController } from "./Controller/DualSenseController.js";
import { PongGameLogic } from "./PongGameLogic.js";
import { PongGameRenderer } from "./PongGameRenderer.js";


export class PongGame {
  constructor() {
  }

  async init (controller1, controller2, skin1, skin2, divId) {
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
    await this.renderer.init(divId, this.logic, skin1, skin2);
  }

  setHost(channel) {
    this.logic.setHost(channel);
  }

  setGuest(channel) {
    this.logic.setGuest(channel);
  }

  async start() {
    await this.renderer.loop();

    if (this.controller2 instanceof AIController) { 
      this.controller2.start();
    }

    this.logic.loop();
  }

  async isEnd() {
    // Promise를 반환
    return new Promise((resolve) => {
      const checkInterval = 100; // 체크 주기(ms)

      // 인터벌로 this.logic.isEnd를 체크
      const intervalId = setInterval(() => {
        if (this.logic.isEnd === true) {
          clearInterval(intervalId); // 인터벌 중지
          resolve(true); // Promise를 해결
        }
      }, checkInterval);
    });
  }

}