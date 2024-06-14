import { renderControlBar } from "./renderControlBar";
export function otpUtil() {
document.querySelector('#otpInput').focus();
document.querySelector('#otpInput').onkeyup = function(e) {
    if (e.key === 'Enter') {  // enter, return
        document.querySelector('#submit').click();
    }
};

document.querySelector('#otpSubmit').onclick = function(e) {
    var OTP_num = document.querySelector('#otpInput').value;
    const token = localStorage.getItem('accessToken');
    const response = fetch(`twofactor/mail/?OTP=${OTP_num}`, {
    method: 'GET',
    headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();  // 서버 응답을 JSON 객체로 변환
    })
    .then(data => {
        console.log(data);  // 서버의 응답을 콘솔에 출력
        if (data.message === "OK") {
            renderControlBar("/")
        } else {
            alert("Fail: " + data.message);
        }
    })
};
document.querySelector('#otpSend').onclick = function(e) {
    const token = localStorage.getItem('accessToken');
    const response = fetch('twofactor/mail/', {
    method: 'POST',
    headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + token
        },
    });
};
}