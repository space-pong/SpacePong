import { AIController } from "./Controller/AIController.js";
import { Controller } from "./Controller/Controller.js";
import { DualSenseController } from "./Controller/DualSenseController.js";

export class PongGameLogic {
  constructor(controller1, controller2) {
    this.fieldWidth = 120;
    this.fieldDepth = 160;
    this.paddleWidth = 18;
    this.speedZ = 1.8;
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
    this.update = this.#update.bind(this);
    this.loop = this.loop.bind(this);
    this.targetScore = 3;
    this.pauseDuration = 90;
    this.isHost = false;
    this.isGuest = false;
    this.channel = null;
  }

  

  setHost(channel) {
    if (this.isHost || this.isGuest) {
      return false;
    }
    this.isHost = true;
    this.channel = channel;
    this.socket = new WebSocket("ws://" + window.location.host + '/ws/pong/');
  }

  setGuest(channel) {
    if (this.isHost || this.isGuest) {
      return false;
    }
    this.isGuest = true;
    this.channel = channel;
  }


  #send() {
    this.socket.send(JSON.stringify({
      'position' : this.player1.position
    }));
  }

  #recv() {
    
  }

  async loop() {
    this.startTime = performance.now();

    // 리모트인 경우 
    if (this.isHost) {
      // 호스트 <- 게스트 : 컨트롤러 입력값
      // 호스트 -> 게스트 : 게임 상태
    } else if (this.isGuest) {
      // 게스트 <- 호스트 : 게임상태
      // 게스트 -> 호스트 : 컨트롤러 입력값
    }

    // 로직 처리(로컬)
    if (this.pauseDuration) {
      this.pauseDuration--;
    } else {
      await this.#update();
    }

    if (this.player1.score == this.targetScore || this.player2.score == this.targetScore) {
      return;
    }
    let endTime = performance.now();
    let gapTime = this.startTime - endTime;
    if (gapTime < (1000 / 60)) {
      setTimeout(this.loop, (1000 / 60) - gapTime);
    } else {
      setTimeout(this.loop, 0);
    }
    
  }

  async #update() {
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
    if (this.ball.position.z >= this.fieldDepth / 2) { // 라인을 넘었을 경우 : 1p
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
        this.pauseDuration = 90;
      }
    } else if (this.ball.position.z <= -this.fieldDepth / 2) { // 라인을 넘었을 경우 : 2p
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
        this.pauseDuration = 90;
      }
    }

    // 공 속도 점점 빠르게
    if (this.ball.velocity.z > 0) {
      this.ball.velocity.z += 0.001;
    } else if (this.ball.velocity.z < 0) {
      this.ball.velocity.z -= 0.001;
    }

  }
}