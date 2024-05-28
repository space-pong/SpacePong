import { Controller } from "./Controller.js";

export class AIController extends Controller {
  constructor() {
    super();
    this.updateMovement = this.updateMovement.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  linkGameLogic (pongGame) {
    this.pongGameInstance = pongGame;
  }

  start() {
    this.updateInfo();
    this.updateMovement();
  }

  updateMovement() {
    if (this.pongGameInstance.player2.position.x < this.targetX - 3) {
      this.left = false;
      this.right = true;
    } else if (this.pongGameInstance.player2.position.x > this.targetX + 3) {
      this.left = true;
      this.right = false;
    } else {
      this.left = false;
      this.right = false;
    }
    setTimeout(this.updateMovement, 16);
  }

  updateInfo() {
    if (this.pongGameInstance.ball.velocity.z > 0) {
      this.targetX = 0;
    } else {
      let ballPosX = this.pongGameInstance.ball.position.x;
      let ballPosZ = this.pongGameInstance.ball.position.z;
      let ballVelX = this.pongGameInstance.ball.velocity.x;
      let ballVelZ = this.pongGameInstance.ball.velocity.z;
      let fieldDepth = this.pongGameInstance.fieldDepth;
      let fieldWidth = this.pongGameInstance.fieldWidth;
      while (ballPosZ > -fieldDepth / 2) {
        ballPosX += ballVelX;
        ballPosZ += ballVelZ;
        if (ballPosX >= fieldWidth / 2) {
          ballPosX = fieldWidth / 2;
          ballVelX *= -1;
        } else if (ballPosX <= -fieldWidth / 2) {
          ballPosX = -fieldWidth / 2;
          ballVelX *= -1;
        }
      }
      this.targetX = ballPosX;
    }
    setTimeout(this.updateInfo, 1000);
  }
}