export function otpUtil() {
    document.querySelector('#otpInput').focus();
    document.querySelector('#otpInput').onkeyup = function(e) {
        if (e.key === 'Enter') {
            document.querySelector('#otpSubmit').click();
        }
    };

    document.querySelector('#otpSubmit').onclick = async function(e) {
        const OTP_num = document.querySelector('#otpInput').value;
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
            console.log(data);
            if (data.message === "OK") {
                window.location.pathname = '/index.html';
            } else {
                alert("Fail: " + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
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