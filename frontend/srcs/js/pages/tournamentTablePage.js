import globalState from "../globalState.js";

export const tournamentTablePage = {
  
  getHtml() {
    var groupA = "";
    var groupB = "";
    var final = "";
    if (globalState.step == 5) {
      groupA = "next";
    } else if (globalState.step == 6) {
      groupB = "next";
    } else if (globalState.step == 7) {
      final = "next";
    }
    return `
    <div class="control-bar__title">Tournament</div>
    <div class="control-bar__type">match plan</div>
    <div class="round">
        <div class="matchup ${groupA}">
          <div class="matchup__type">Group A</div>
          <div class="player">${globalState.tournament.groupAHome}</div>
          <div class="player">${globalState.tournament.groupAAway}</div>
        </div>
        <div class="matchup ${groupB}">
          <div class="matchup__type">Group B</div>
          <div class="player">${globalState.tournament.groupBHome}</div>
          <div class="player">${globalState.tournament.groupBAway}</div>
        </div>
    </div>
    <div class="round">
        <div class="matchup ${final}">
          <div class="matchup__type">Final</div>
          <div class="player">${globalState.tournament.finalAway}</div>
          <div class="player">${globalState.tournament.finalHome}</div>
        </div>
    </div>
    <div class="control-bar__confirm">
      <button class="control-bar__confirm__btn--next" data-link="dynamicPage">Next</button>
    </div>
    `;
  },
  css: 'styles/css/tournamentTablePage.css'
};