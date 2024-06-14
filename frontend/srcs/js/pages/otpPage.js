export const otpPage = {
    getHtml() {
        let timerId;
        async function updateTimer() {
            const now = new Date();
            const seconds = now.getSeconds();
            const secondsRemaining = 60 - seconds;
            document.getElementById('otpTimer').textContent = secondsRemaining;
            if (secondsRemaining === 0) {
                clearInterval(timerId);
            }
        }
        timerId = setInterval(updateTimer, 1000);
        return `
        <header class="control-bar__otp__header">
            give me OTP number
        </header>
        <div class="control-bar__otp__input">
            <input id="otpInput" type="text" class="textbox" maxlength="4">
            <input id="otpSubmit" type="button" value="Enter">
            <input id="otpSend" type="button" value="send">
            <div id="otpTimer">00</div>
        </div>
        `;
    },
    
    css: 'styles/css/otpPage.css', 
};