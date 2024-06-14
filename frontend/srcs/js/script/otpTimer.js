function updateTimer() {
    const timerElement = document.getElementById('otpTimer');
    let secondsRemaining = parseInt(timerElement.textContent, 10);

    if (secondsRemaining > 0) {
        secondsRemaining -= 1;
        timerElement.textContent = secondsRemaining < 10 ? '0' + secondsRemaining : secondsRemaining;
    }
}

document.addEventListener('DOMContentLoaded', () => { 
    setInterval(updateTimer, 1000);
});