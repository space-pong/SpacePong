import globalState from '../globalState.js';

export function otpUtil() {
    document.querySelector('#otpInput').focus();
    document.querySelector('#otpInput').onkeyup = function(e) {

        if (e.key === 'Enter') {
            document.querySelector('#otpSubmit').click();
        }
    };

    document.querySelector('#otpSubmit').onclick = async function(e) {
        const OTP_num = document.querySelector('#otpInput').value.trim();
        if (OTP_num)
        {
            console.log("I have otp num!");
            const token = localStorage.getItem('accessToken');
            try {
                const response = await fetch(`twofactor/mail/?OTP=${OTP_num}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + token
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                console.log("data: " , data);
                console.log("data.message: ", data.message);
                if (data === "OTP OK") {
                    globalState.otp == true;
                    window.location.pathname = '/index.html';
                } else {
                    alert("OTP authentication failed");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            alert("please enter otp number!");
        }
    };

    document.querySelector('#otpSend').onclick = async function(e) {
        const token = localStorage.getItem('accessToken');
        try {
            await fetch('twofactor/mail/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                },
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };
}