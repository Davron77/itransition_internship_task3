class Rules {
  constructor(moves) {
    this.moves = moves;
    this.half = Math.floor(moves.length / 2);
  }

  getResult(playerMove, computerMove) {
    const playerIndex = this.moves.indexOf(playerMove);
    const computerIndex = this.moves.indexOf(computerMove);

    if (playerIndex === computerIndex) {
      return "Draw";
    } else if (
      (computerIndex > playerIndex &&
        computerIndex - playerIndex <= this.half) ||
      (computerIndex < playerIndex && playerIndex - computerIndex > this.half)
    ) {
      return "Lose";
    } else {
      return "Win";
    }
  }
}

module.exports = Rules;
