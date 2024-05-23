import { AIController } from "./AIController.js";
import { Controller } from "./Controller.js";
import { DualSenseController } from "./DualSenseController.js";

export class PongGameLogic {
  constructor(controller1, controller2) {

    this.fieldWidth = 120;
    this.fieldDepth = 160;
    this.paddleWidth = 18;
    this.speedZ = 2.5;
    
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
      velocity: { x: 0, y: 0, z: this.speedZ }
    };

    this.isPlayer1Strike = false;
    this.isPlayer2Strike = false;
    this.isWallStrike = false;
    this.update = this.update.bind(this);
  }

  start() {
    this.update();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async update() {
    if (this.player1.score == 10 || this.player2.score == 10) {
      return ;
    }
    // 컨트롤러값으로 기체 움직임 적용
    let player1Moved = false;
    if (this.player1.controller.left == true) {
      this.player1.position.x -= 1.5;
      player1Moved = true;
    }
    if (this.player1.controller.right == true) {
      this.player1.position.x += 1.5;
      player1Moved = true;
    }
    if (this.player2.controller.left == true) {
      this.player2.position.x -= 1.5;
    }
    if (this.player2.controller.right == true) {
      this.player2.position.x += 1.5;
    }
    if (Math.abs(this.player1.controller.stick.x) > 0.05 && player1Moved == false) {
      this.player1.position.x += 1.5 * this.player1.controller.stick.x;
    }
    
    
    // 기체 움직임 범위 제한
    this.player1.position.x = Math.max(
      -this.fieldWidth / 2 + this.paddleWidth / 2,
      Math.min(this.fieldWidth / 2 - this.paddleWidth / 2, this.player1.position.x)
    );
    this.player2.position.x = Math.max(
      -this.fieldWidth / 2 + this.paddleWidth / 2,
      Math.min(this.fieldWidth / 2 - this.paddleWidth / 2, this.player2.position.x)
    );

    // 공 움직임
    this.ball.position.x += this.ball.velocity.x;
    this.ball.position.z += this.ball.velocity.z;

    // 공이 벽에 충돌했을 경우
    if (this.ball.position.x >= this.fieldWidth / 2) {
      this.ball.position.x = this.fieldWidth / 2;
      this.ball.velocity.x *= -1;
      this.isWallStrike = true;
    } else if (this.ball.position.x <= -this.fieldWidth / 2) {
      this.ball.position.x = -this.fieldWidth / 2;
      this.ball.velocity.x *= -1;
      this.isWallStrike = true;
    }

    // 공이 라인을 넘었을 경우 (공 반사 or 실점 판정)
    if (this.ball.position.z >= this.fieldDepth / 2) { // 공이 플레이어 1의 라인을 넘었을 경우
      if (this.player1.position.x - (this.paddleWidth / 2) <= this.ball.position.x && // 공 반사
        this.ball.position.x <= this.player1.position.x + (this.paddleWidth / 2)) {
          this.ball.position.z = this.fieldDepth / 2;
          this.ball.velocity.z *= -1;
          this.ball.velocity.x = (this.ball.position.x - this.player1.position.x) / ((this.paddleWidth / 2) + 0.1) * this.speedZ;
          if (this.player1.controller instanceof DualSenseController) {
            if (this.player1.controller.ds) {
              this.player1.controller.ds.setHeavyMotorByDuration(200, 100);
            }
          }
          this.isPlayer1Strike = true;
      } else { // 실점 판정
        this.player2.score++;
        this.ball.velocity.z = -this.speedZ;
        this.ball.velocity.x = 0;
        this.ball.position.x = 0;
        this.ball.position.z = 0;
        this.player1.position.x = 0;
        this.player2.position.x = 0;
        await this.sleep(1500);
      }
    } else if (this.ball.position.z <= -this.fieldDepth / 2) { // 공이 플레이어 2의 라인을 넘었을 경우
      if (this.player2.position.x - (this.paddleWidth / 2) <= this.ball.position.x && // 공 반사
        this.ball.position.x <= this.player2.position.x + (this.paddleWidth / 2)) {
          this.ball.position.z = -this.fieldDepth / 2;
          this.ball.velocity.z *= -1;
          this.ball.velocity.x = this.ball.velocity.x = (this.ball.position.x - this.player2.position.x) / ((this.paddleWidth / 2) + 0.1) * this.speedZ;
          if (this.player2.controller instanceof DualSenseController) {
            if (this.player2.controller.ds) {
              this.player2.controller.ds.setHeavyMotorByDuration(200, 100);
            }
          }
          this.isPlayer2Strike = true;
      } else { // 실점 판정
        this.player1.score++;
        this.ball.velocity.z = this.speedZ;
        this.ball.velocity.x = 0;
        this.ball.position.x = 0;
        this.ball.position.z = 0;
        this.player1.position.x = 0;
        this.player2.position.x = 0;
        await this.sleep(1500);
      }
    }
    setTimeout(this.update, 16.6667);
  }


}