const AsciiTable = require("ascii-table");

class HelpTable {
  constructor(moves) {
    this.moves = moves;
    this.numMoves = moves.length;
  }

  generateTable() {
    const half = Math.floor(this.numMoves / 2);
    const table = new AsciiTable();

    table.setHeading("v PC\\User >", ...this.moves);

    for (let i = 0; i < this.numMoves; i++) {
      const row = [];
      for (let j = 0; j < this.numMoves; j++) {
        if (i === j) {
          row.push("Draw");
        } else if (
          (j > i && j <= i + half) ||
          (j < i && j + this.numMoves <= i + half)
        ) {
          row.push("Win");
        } else {
          row.push("Lose");
        }
      }
      table.addRow(this.moves[i], ...row);
    }

    console.log(table.toString());
  }
}
module.exports = HelpTable;
