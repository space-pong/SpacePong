import { Controller } from "./Controller.js";

export class PongGame {
  constructor(controller1, controller2) {
    
    this.player1 = {
      position: { x: 0, y: 0, z: 80 },
      score: 0,
      controller: controller1
    };

    this.player2 = {
      position: { x: 0, y: 0, z: -80 },
      score: 0,
      controller: controller2
    };

    this.ball = {
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 1 }
    };

    this.fieldWidth = 120;
    this.fieldDepth = 160;
    this.paddleWidth = 18;
  }

  update() {
    if (this.player1.controller.left == true) {
      this.player1.position.x -= 1.5;
    }

    if (this.player1.controller.right == true) {
      this.player1.position.x += 1.5;
    }

    if (this.player2.controller.left == true) {
      this.player2.position.x -= 1.5;
    }

    if (this.player2.controller.right == true) {
      this.player2.position.x += 1.5;
    }

    this.player1.position.x = Math.max(
      -this.fieldWidth / 2 + this.paddleWidth / 2,
      Math.min(this.fieldWidth / 2 - this.paddleWidth / 2, this.player1.position.x)
    );

    this.player2.position.x = Math.max(
      -this.fieldWidth / 2 + this.paddleWidth / 2,
      Math.min(this.fieldWidth / 2 - this.paddleWidth / 2, this.player2.position.x)
    );
  }

}