import { loadTranslation } from "../utils/translate.js";

export const otpPage = {
    async getHtml() {
        let timerId;
        async function updateTimer() {
            const now = new Date();
            const seconds = now.getSeconds();
            const secondsRemaining = 60 - seconds;
            const otpTimerElement = document.getElementById('otpTimer');
            if (otpTimerElement) {
                otpTimerElement.textContent = secondsRemaining;
            }
            if (secondsRemaining === 0) {
                clearInterval(timerId);
            }
        }
        timerId = setInterval(updateTimer, 1000);
        return `
        <header class="control-bar__otp__header">
            ${await loadTranslation("Enter OTP number")}
        </header>

        <div class="control-bar__otp__guide">
          <p class="otpGuide">1. ${await loadTranslation("Click \"Send\" button")}.</p>
          <p class="otpGuide">2. ${await loadTranslation("Enter OTP number")}.</p>
        </div>

        <div class="control-bar__otp__input">
          <div id="otpTimer">00</div>
          <input id="otpInput" type="text" class="textbox" maxlength="4">
          <div id="otpButton">
            <input id="otpSend" data-link="otpSend" type="button" value=${await loadTranslation("Send")}>
            <input id="otpSubmit" data-link="otpSubmit" type="button" value=${await loadTranslation("Enter")}>
          </div>
        </div>
        `;
    },
    
    css: 'styles/css/otpPage.css', 

    // init() {
    //     let timerId;
    //     async function updateTimer() {
    //         const now = new Date();
    //         const seconds = now.getSeconds();
    //         const secondsRemaining = 60 - seconds;
    //         const otpTimerElement = document.getElementById('otpTimer');
    //         if (otpTimerElement) {
    //             otpTimerElement.textContent = secondsRemaining;
    //         }
    //         if (secondsRemaining === 0) {
    //             clearInterval(timerId);
    //         }
    //     }
    //     timerId = setInterval(updateTimer, 1000);
    // }
};