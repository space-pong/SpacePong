const globalState = {

  intraID: null,
  gameMode: null,
  step: 0,
  currentAlias: null,
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
    groupAHome: "jeekpark",
    groupAAway: "tnam",
    groupBHome: "eoh",
    groupBAway: "dmin",
    finalHome: "n/a",
    finalAway: "n/a"
  },
  winner: null,
};

export default globalState;
