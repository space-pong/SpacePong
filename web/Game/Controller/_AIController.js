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
    setTimeout(this.updateMovement, 1000 / 60);
  }

  updateInfo() {
    let ballPosX = this.pongGameInstance.ball.position.x;
    let ballPosZ = this.pongGameInstance.ball.position.z;
    let ballVelX = this.pongGameInstance.ball.velocity.x;
    let ballVelZ = this.pongGameInstance.ball.velocity.z;
    let fieldDepth = this.pongGameInstance.fieldDepth;
    let fieldWidth = this.pongGameInstance.fieldWidth;
    let pauseDuration = this.pongGameInstance.pauseDuration;
    if (ballVelZ > 0) { // 공격 턴
      this.targetX = 0; // 공격 턴일 땐 무조건 중앙 포지셔닝
      if (pauseDuration > 0) {// 일시 정지 케이스
        const fastestInfoInTime = ((((fieldDepth / 2) / ballVelZ) / 60) * 1000) + (pauseDuration * (1000 / 60));
        console.log("attack1");
        setTimeout(this.updateInfo, Math.max(fastestInfoInTime, 1000));
      } else { // 공이 이동 중일 때
        const fastestInfoInTime = ((((fieldDepth / 2) - ballPosZ) / ballVelZ) / 60);
        console.log("attack2");
        setTimeout(this.updateInfo, Math.max(fastestInfoInTime, 1000));
      }
    } else { // 방어 턴
      const deltaZ = (ballPosZ + (fieldDepth / 2));
      const defenseInTime = ((deltaZ / Math.abs(ballVelZ)) / 60) * 1000;
      let estimatePosX = ballPosX;
      let estimatePosZ = ballPosZ;
      let estimateVelX = ballVelX;
      while (estimatePosZ > -fieldDepth / 2) {
        estimatePosX += estimateVelX;
        estimatePosZ += ballVelZ;
        if (estimatePosX >= fieldWidth / 2) {
          estimatePosX = fieldWidth / 2;
          estimateVelX *= -1;
        } else if (estimatePosX <= -fieldWidth / 2) {
          estimatePosX = -fieldWidth / 2;
          estimateVelX *= -1;
        }
      }
      this.targetX = estimatePosX;
      console.log("defense! " + getCurrentTimeFormatted());
      setTimeout(this.updateInfo, defenseInTime + ((fieldDepth / Math.abs(ballVelZ)) * (1000 / 60)) + 5);
    }


/*     if (this.pongGameInstance.ball.velocity.z > 0) {
      this.isAttackingTurn = true;
    } else {
      this.isAttackingTurn = false;
      
      let step = 0;
      while (ballPosZ > -fieldDepth / 2) {
        ballPosX += ballVelX;
        ballPosZ += ballVelZ;
        step++;
        if (ballPosX >= fieldWidth / 2) {
          ballPosX = fieldWidth / 2;
          ballVelX *= -1;
        } else if (ballPosX <= -fieldWidth / 2) {
          ballPosX = -fieldWidth / 2;
          ballVelX *= -1;
        }
      }
      this.targetX = ballPosX;
      setTimeout(this.updateInfo, )
    }
    setTimeout(this.updateInfo, 1000); */
  }
}

function getCurrentTimeFormatted() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

  return `${hours}시 ${minutes}분 ${seconds}초 ${milliseconds}밀리초`;
}