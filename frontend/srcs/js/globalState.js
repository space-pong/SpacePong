const globalState = {
  intraID: null,
  gameMode: null,
  step: 0,
  currentAlias: null,
  oppsiteAlias: null,
  otp: false,
  alias: {
    player1: null,
    player2: "guest1",
    player3: "guest2",
    player4: "guest3",
  },
  unit: {
    player1: null,
    player2: null,
    player3: null,
    player4: null,
  },
  tournament: {
    groupAHome: null,
    groupAAway: null,
    groupBHome: null,
    groupBAway: null,
    finalHome: "n/a",
    finalAway: "n/a"
  },
  winner: null,
};

export default globalState;

export function resetGlobalState() {
  globalState.gameMode = null;
  globalState.step = 0;
  globalState.currentAlias = globalState.intraID;
  globalState.oppsiteAlias = null;
  globalState.alias.player1 = globalState.intraID;
  globalState.alias.player2 = "guest1";
  globalState.alias.player3 = "guest2";
  globalState.alias.player4 = "guest3";
  globalState.unit.player1 = null;
  globalState.unit.player2 = null;
  globalState.unit.player3 = null;
  globalState.unit.player4 = null;
  globalState.tournament.groupAHome = null;
  globalState.tournament.groupAAway = null;
  globalState.tournament.groupBHome = null;
  globalState.tournament.groupBAway = null;
  globalState.tournament.finalHome = "n/a";
  globalState.tournament.finalAway = "n/a";
  globalState.winner = null;
}
