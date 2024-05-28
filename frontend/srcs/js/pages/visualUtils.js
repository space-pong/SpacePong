
// 카메라 흔들림
export function shakeCamera(camera, duration = 100, intensity = 0.05) {
  const startTime = Date.now();
  const originalPosition = camera.position.clone();
  function shake() {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < duration) {
      const progress = elapsedTime / duration;
      const xShake = (Math.random() - 0.5) * intensity * (1 - progress);
      const yShake = (Math.random() - 0.5) * intensity * (1 - progress);
      camera.position.x = originalPosition.x + xShake;
      camera.position.y = originalPosition.y + yShake;
      requestAnimationFrame(shake);
    } else {
      camera.position.copy(originalPosition); // 흔들림 종료 후 원래 위치로 복귀
    }
  }
  shake();
}

// 기체 틸트
export function tiltZ(object, targetRotationZ) {
  if (targetRotationZ == object.rotation.z) {
    return ;
  } else {
    if (targetRotationZ > object.rotation.z) {
      object.rotation.z += 0.04;
      if (object.rotation.y > targetRotationZ) {
        object.rotation.z = targetRotationZ;
      }
    } else if (targetRotationZ < object.rotation.z) {
      object.rotation.z -= 0.04;
      if (object.rotation.z < targetRotationZ) {
        object.rotation.z = targetRotationZ;
      }
    }
  }
}