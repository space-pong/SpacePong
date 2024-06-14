export const otpPage = {
    getHtml() {
        return `
        <header class="control-bar__otp__header">
        give me OTP number
        </header>
        <div class=control-bar__otp__input>
            <input id="otpInput" type="text" class="textbox" maxlength="4">
            <input id="otpSubmit" type="button" value="Enter">
            <input id="otpSend" type="button" value="send">
            <div id=otpTimer">00</di v>
        </div>
        `
    },
    css: 'styles/css/otpPage.css'
  };