import Posts from "./views/Posts.js";
import NotFound from "./views/NotFound.js";
import Login from "./views/Login.js";

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
}

const router = async () => {
  const routes = [
    { path: "/", view: Posts},
    { Path: "/Login", view: Login},
    { Path: "/404", view: NotFound}
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatches) => potentialMatches.isMatch);

  if (!match) {
    match = {
      route: routes[routes.length - 1],
      isMatch: true,
    }
  }

  const view = new match.route.view();
  document.querySelector('#app').innerHTML = await view.getHTML();
  window.addEventListener("popstate", router);
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
});