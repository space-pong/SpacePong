import globalState from "../globalState.js";
import { Router } from "../router.js";

export async function fetchTokens(router) {
  try {
    // 현재 URL에서 코드 가져오기
    
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
      return ("code error in fetchToken function");
      // throw new Error('No authorization code provided');
    }
    
    // 액세스 토큰 요청을 위한 fetch 요청
    const response = await fetch(`auth42/callback/?code=${code}`, {
      method: 'GET',  
    });
    
    if (!response.ok) {
      return ;
      throw new Error('Failed to fetch tokens');
    }
    // JSON 형식의 응답 데이터 파싱
    const data = await response.json();
    
    await router.navigateTo("/otp");
      // 로컬 스토리지에 토큰 저장
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('spacePongIntraID', data.intra_id);
    globalState.intraID = data.intra_id;
    // if (globalState.otp == true)
    // {
    //   // 로컬 스토리지에 토큰 저장
    //   localStorage.setItem('accessToken', data.access_token);
    //   localStorage.setItem('spacePongIntraID', data.intra_id);
    //   globalState.intraID = data.intra_id;
    // }
    // else {
    //   console.error("otp error!");
    // }
    // 모드 선택 페이지 렌더링
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return null;
  }
}

export async function checkaccess() {
  let token = localStorage.getItem('accessToken');
  if (token) {
    const accessresponse = await fetch(`auth42/access?access_token=${token}`, {
    method: 'GET'
    });
    if (!accessresponse.ok) {
    const errorData = await accessresponse.json();
    console.error('Error verifying access token:', errorData.error);
    return false;
    }
    const responseData = await accessresponse.json();
   if (!responseData.message) {
    token = responseData.access_token;
    localStorage.setItem('accessToken', responseData.access_token);
    }
    return true;
  }
  else {
    return false;
  }
}

export async function deletetoken() {
  const accessresponse = await fetch(`auth42/logout`, {
    method: 'GET'
  });
  if (!accessresponse.ok) {
    const errorData = await accessresponse.json();
    return false;
  }
  const responseData = await accessresponse.json();
  return true;
}