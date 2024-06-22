import globalState from "../globalState.js";
import { loadTranslation } from "../utils/translate.js";

export const tournamentTablePage = {
  
  async getHtml() {
    var groupA = "";
    var groupB = "";
    var final = "";
    if (globalState.step == 5) {
      groupA = "next";
    } else if (globalState.step == 7) {
      groupB = "next";
    } else if (globalState.step == 9) {
      final = "next";
    }
    var finalHome = "";
    if (globalState.tournament.finalHome == "n/a") {
      finalHome = "n/a";
    } else {
      finalHome = globalState.alias[`player${globalState.tournament.finalHome}`];
    }
    var finalAway = "";
    if (globalState.tournament.finalAway == "n/a") {
      finalAway = "n/a";
    } else {
      finalAway = globalState.alias[`player${globalState.tournament.finalAway}`];
    }
    return `
    <div class="control-bar__title">${await loadTranslation("Tournament")}</div>
    <div class="control-bar__type">${await loadTranslation("match plan")}</div>
    <div class="round">
        <div class="matchup ${groupA}">
          <div class="matchup__type">${await loadTranslation("Group")} A</div>
          <div class="player">${globalState.tournament.groupAHome}</div>
          <div class="player">${globalState.tournament.groupAAway}</div>
        </div>
        <div class="matchup ${groupB}">
          <div class="matchup__type">${await loadTranslation("Group")} B</div>
          <div class="player">${globalState.tournament.groupBHome}</div>
          <div class="player">${globalState.tournament.groupBAway}</div>
        </div>
    </div>
    <div class="round">
        <div class="matchup ${final}">
          <div class="matchup__type">${await loadTranslation("Final")}</div>
          <div class="player">${finalHome}</div>
          <div class="player">${finalAway}</div>
        </div>
    </div>
    <div class="control-bar__confirm">
      <button href="" class="control-bar__confirm__btn--next" data-link>${await loadTranslation("Next")}</button>
    </div>
    `;
  },
  css: 'styles/css/tournamentTablePage.css'
};