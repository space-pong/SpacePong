import { checkaccess } from './checkToken.js'

export async function getData() {
  await checkaccess()
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

export async function postData(data = {}) {
  await checkaccess()
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
    console.error('Error fetching data:');
    return;
  }
  return response.json();
}

export async function deleteData(type) {
  await checkaccess()
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
    console.error('Error fetching data:');
    return;
  }
  return response.json();
}
