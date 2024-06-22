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
    const accessresponse = await fetch(`auth42/access?access_token=${token}}`, {
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

// 저희는 jwt 토큰을 쓰는데,
// Oauth인증을 합니다. 그래서 구조가
// 1. 42로그인 페이지로 리다이렉트 이때 링크가 https://api.login ~ redirect_uri = ~ 
// 2. 그래서 저 링크에 params로 redirec_uri 가 있는데 로그인(authorize)을 하면은 리다이렉트 uri로 넘어갑니다.
// 3. redirect_uri에 추가 params로 code=~ 이렇게 와서 이 code를 백엔드에 넘기면 백엔드에서 이 코드를 검증하고 jwt를 반환해줘서
// 4. 이거를 localstorage에 저장하고 나머지 api들에서 헤더에 Bearer+~ 로해서 같이 토큰도 넘기는식으로 사용해요!
// 근데 eoh님네는 acces_token발급하는 부분밖에없어서 물어봤습니다..!  제가 알기로는 oauth관련해선 저렇게 링크로 리다이렉트하고 로그인하는게 더편한걸로 알아서..
// 이게 최신으로 알고있긴해요 42api참고하시면 좋을 것 같습니다