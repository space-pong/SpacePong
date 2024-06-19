import { AIController } from "./Controller/AIController.js";
import { Controller } from "./Controller/Controller.js";
import { DualSenseController } from "./Controller/DualSenseController.js";
import globalState from '../globalState.js';

export class PongGameLogic {
  constructor(controller1, controller2) {
    this.fieldWidth = 120;
    this.fieldDepth = 160;
    this.paddleWidth = 18;
    this.speedZ = 1.8;
    this.player1 = {
      position: { x: 0, y: 0, z: 80 },
      score: 0,
      scoreQuery: null,
      controller: controller1
    };
    this.player2 = {
      position: { x: 0, y: 0, z: -80 },
      score: 0,
      scoreQuery: null,
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
    this.targetScore = 5;
    this.pauseDuration = 1500;
    this.startTime = null;
    this.endTime = null;
    this.isHost = false;
    this.isGuest = false;
    this.channel = null;
    this.isEnd = false;
    this.winner = null;
    this.sendCount = 0;
    this.delta = 1000.0 / 60.0;
  }

  setScoreID(player1ScoreID, player2ScoreID) {
    this.player1.scoreQuery = document.querySelector(player1ScoreID);
    this.player2.scoreQuery = document.querySelector(player2ScoreID);
  }

  setHost(channel) {
    if (this.isHost || this.isGuest) {
      return false;
    }
    this.isHost = true;
    this.channel = channel;
    this.socket = new WebSocket("wss://" + window.location.host + '/ws/channel/' + channel + '/');
    // WebSocket 메시지 수신 이벤트 리스너 등록
    this.socket.onmessage = this.#recv.bind(this);
  }

  setGuest(channel) {
    if (this.isHost || this.isGuest) {
      return false;
    }
    this.isGuest = true;
    this.channel = channel;
    this.speedZ *= -1;
    this.ball.velocity.z = this.speedZ;
    this.socket = new WebSocket("wss://" + window.location.host + '/ws/channel/' + channel + '/');
    // WebSocket 메시지 수신 이벤트 리스너 등록
    this.socket.onmessage = this.#recv.bind(this);
    this.updateGuestScore();
  }
  
  #send() {
    // 메시지에 player의 위치와 이름을 포함
    const message = {
      user_name: globalState.currentAlias,
      user_position: this.player1.position.x,
      left_press: this.player1.controller.left,
      right_press: this.player1.controller.right
    };
    // host일 경우 메시지에 공의 위치도 포함
    if (this.isHost) {
      message.ball_object = this.ball;
      message.player1_score = this.player1.score;
      message.player2_score = this.player2.score;
      message.pause_duration = this.pauseDuration;
    }
    // 메시지 전송
    this.socket.send(JSON.stringify(message));
  }

  #recv(event) {
    const data = JSON.parse(event.data);
    console.log(data);
    // 상대방 연결이 끊긴 경우
    if (data.disconnect === "true"){
      this.winner = "1";
      this.isEnd = true;
      this.socket.close();
      return;
    }
    // 상대방이 보낸 데이터인 경우 상대방 위치 업데이트
    if (data.user_name !== globalState.currentAlias) {
      this.player2.position.x = data.user_position;
      this.player2.position.x *= -1;
      this.player2.controller.left = data.right_press;
      this.player2.controller.right = data.left_press;
    }
    // guest인 경우, ball position 업데이트
    if (this.isGuest && data.ball_object){
      this.ball = data.ball_object;
      this.ball.position.x *= -1;  // X 축 위치를 반전시킴
      this.ball.position.z *= -1;  // Z 축 위치를 반전시킴
      this.ball.velocity.x *= -1;  // X 축 위치를 반전시킴
      this.ball.velocity.z *= -1;  // Z 축 위치를 반전시킴
      this.player1.score = data.player2_score;
      this.player2.score = data.player1_score;
      this.pauseDuration = data.pause_duration;
      if (data.pause_duration) {
        this.player1.position.x = 0;
      }
    }
  }

  async loop() {
    this.startTime = performance.now();
    if (this.endTime != null) {
      this.delta = this.startTime - this.endTime;
    }
    // 로직 처리
    if (this.pauseDuration) {
      this.pauseDuration = Math.max(this.pauseDuration - this.delta, 0);
    } else {
      this.#update(this.delta / (1000.0 / 60.0));
      // 리모트인 경우
      if ((this.isHost || this.isGuest) && this.socket.readyState === WebSocket.OPEN) {
        if (this.sendCount % 4 == 0) { // 30
          this.#send();
        }
        this.sendCount++;
      }
    }
    if (this.player1.score == this.targetScore || this.player2.score == this.targetScore) {
      this.isEnd = true;
      if (this.player1.score == this.targetScore) {
        this.winner = "1";
      } else {
        this.winner = "2";
      }
      this.#send();
      return;
    }
    this.endTime = performance.now();
    let gapTime = this.startTime - this.endTime;
    if (gapTime < (1000.0 / 60.0)) {
      setTimeout(this.loop, (1000.0 / 60.0) - gapTime);
    } else {
      setTimeout(this.loop, 0);
    }
    
  }

  updateGuestScore() {
    this.player1.scoreQuery.innerHTML = this.player1.score;
    this.player2.scoreQuery.innerHTML = this.player2.score;
    setTimeout(this.updateGuestScore.bind(this), 1000);
  }

  async #update(delta) {
    // 컨트롤러값으로 기체 움직임 적용
    let player1Moved = false;
    if (this.player1.controller.left == true) {
      this.player1.position.x -= 1.5 * delta;
      player1Moved = true;
    }
    if (this.player1.controller.right == true) {
      this.player1.position.x += 1.5 * delta;
      player1Moved = true;
    }
    if (this.player2.controller.left == true) {
      this.player2.position.x -= 1.5 * delta;
    }
    if (this.player2.controller.right == true) {
      this.player2.position.x += 1.5 * delta;
    }
    if (Math.abs(this.player1.controller.stick.x) > 0.05 && player1Moved == false) {
      this.player1.position.x += 1.5 * this.player1.controller.stick.x * delta;
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
    this.ball.position.x += this.ball.velocity.x * delta;
    this.ball.position.z += this.ball.velocity.z * delta;

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
        if (!this.isGuest){
          this.player2.score++;
          if (this.player1.scoreQuery) {
            if (this.isGuest == false) {
              this.player2.scoreQuery.innerHTML = this.player2.score;
            }
          }
          this.ball.velocity.z = -this.speedZ;
          this.ball.velocity.x = 0;
          this.ball.position.x = 0;
          this.ball.position.z = 0;
          this.player1.position.x = 0;
          this.player2.position.x = 0;
          this.pauseDuration = 1500;
        }
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
        if (!this.isGuest){
          this.player1.score++;
          if (this.player1.scoreQuery) {
            if (this.isGuest == false) {
              this.player1.scoreQuery.innerHTML = this.player1.score;
            }
          }
          this.ball.velocity.z = this.speedZ;
          this.ball.velocity.x = 0;
          this.ball.position.x = 0;
          this.ball.position.z = 0;
          this.player1.position.x = 0;
          this.player2.position.x = 0;
          this.pauseDuration = 1500;
        }
      }
    }

    // 공 속도 점점 빠르게
    if (this.ball.velocity.z > 0) {
      this.ball.velocity.z += 0.001 * delta;
    } else if (this.ball.velocity.z < 0) {
      this.ball.velocity.z -= 0.001 * delta;
    }

  }
}
