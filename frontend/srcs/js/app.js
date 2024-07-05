import {fetchTokens, checkaccess} from './utils/checkToken.js'
import globalState from './globalState.js'; 
import { Router } from './router.js';
import { checkOTP } from './utils/api.js'

async function handleLogin(router) {
  let isLoggedIn = await checkaccess();
  let hasOTP = await checkOTP();
  if (isLoggedIn && hasOTP === true) {
    globalState.intraID = localStorage.getItem('spacePongIntraID');
  } else {
    await fetchTokens(router);
    isLoggedIn = await checkaccess();
    if (!isLoggedIn) {
      await router.navigateTo("/login");
    }
  }
  hasOTP = await checkOTP();
  if (isLoggedIn && !hasOTP) {
    await router.navigateTo("/otp");
  }
}

async function init() {
  const router = new Router();
  await handleLogin(router);
  router.route(router);
}

window.addEventListener('DOMContentLoaded', init);

