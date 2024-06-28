import { checkaccess } from './checkToken.js'

export async function getData() {
  await checkaccess();
  const token = localStorage.getItem('accessToken');
  const response = await fetch('spacepong/data/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',// 이거 안쓰면 못읽음
      'Authorization': 'Bearer ' + token,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error fetching data:', errorData);
    return;
  }
  const data = await response.json();
  return data;
}

export async function postData(skin) {
  await checkaccess();
  let data = {
    "mySkin": skin
  };
  const token = localStorage.getItem('accessToken');
  const response = await fetch('spacepong/data/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    console.error('Error post data:');
    return;
  }
  return response.json();
}

export async function deleteData(type) {
  await checkaccess();
  let data = {
    "delete_field": type
  };
  const token = localStorage.getItem('accessToken');
  const response = await fetch('spacepong/data/', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    console.error('Error delete data:');
    return;
  }
  return response.json();
}

export async function checkOTP() {
  await checkaccess();
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return;
  }
  const response = await fetch('twofactor/auth/', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
  });
  if (!response.ok) {
    console.error('Error check OTP data:');
    return;
  }
  const data = await response.json();
  if (data === "success") {
    return true;
  } else {
    return false;
  }
}

export async function registerOTP() {
  await checkaccess();
  const token = localStorage.getItem('accessToken');
  const response = await fetch('twofactor/auth/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    }
  });
  if (!response.ok) {
    console.error('Error post OTP data:');
  }
}

export async function deleteOTP() {
  await checkaccess();
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return;
  }
  const response = await fetch('twofactor/auth/', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
  });
  if (!response.ok) {
    console.error('Error delete OTP data:');
  }
}