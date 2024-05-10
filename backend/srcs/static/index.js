const menuHome = () => {
  document.getElementById("contentFrame").setAttribute("src", "home.html");
  document.getElementById("menuHome").style = "color: black; background-color: white;"
  document.getElementById("menuJukebox").style = "color: black; background-color: #298eb5;"
  document.getElementById("menuGame").style = "color: black; background-color: #298eb5;"
}

const menuJukebox = () => {
  document.getElementById("contentFrame").setAttribute("src", "jukebox.html");
  document.getElementById("menuJukebox").style = "color: black; background-color: white;"
  document.getElementById("menuHome").style = "color: black; background-color: #298eb5;"
  document.getElementById("menuGame").style = "color: black; background-color: #298eb5;"
}
const menuGame = () => {
  document.getElementById("contentFrame").setAttribute("src", "game.html");
  document.getElementById("menuGame").style = "color: black; background-color: white;"
  document.getElementById("menuJukebox").style = "color: black; background-color: #298eb5;"
  document.getElementById("menuHome").style = "color: black; background-color: #298eb5;"
}

