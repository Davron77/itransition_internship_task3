const crypto = require("crypto");
const readline = require("readline");

class KeyGenerator {
  static generateKey() {
    return crypto.randomBytes(32).toString("hex");
  }
}

class HMACGenerator {
  static generateHMAC(key, message) {
    return crypto.createHmac("sha256", key).update(message).digest("hex");
  }
}

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

class HelpTable {
  constructor(moves) {
    this.moves = moves;
    this.numMoves = moves.length;
  }

  generateTable() {
    const half = Math.floor(this.numMoves / 2);

    const longestMove = this.moves.reduce((a, b) =>
      a.length > b.length ? a : b
    );
    const cellWidth = Math.max(longestMove.length, 5);

    const pad = (text, width) => text.padEnd(width);

    const colWidths = [11, ...this.moves.map(() => cellWidth)];

    const separator =
      "+" + colWidths.map((width) => "-".repeat(width + 2)).join("+") + "+";

    const header = `| ${pad("PC\\User >", 11)} | ${this.moves
      .map((move) => pad(move, cellWidth))
      .join(" | ")} |`;

    console.log(separator);
    console.log(header);
    console.log(separator);

    for (let i = 0; i < this.numMoves; i++) {
      let row = `| ${pad(this.moves[i], 11)} |`; 
      for (let j = 0; j < this.numMoves; j++) {
        if (i === j) {
          row += ` ${pad("Draw", cellWidth)} |`;
        } else if (
          (j > i && j <= i + half) ||
          (j < i && j + this.numMoves <= i + half)
        ) {
          row += ` ${pad("Win", cellWidth)} |`; 
        } else {
          row += ` ${pad("Lose", cellWidth)} |`;
        }
      }
      console.log(row);
      console.log(separator);
    }
  }
}

const args = process.argv.slice(2);
if (args.length < 3 || args.length % 2 === 0) {
  console.error(
    "Error: You must provide an odd number of non-repeating moves (>=3). Example: node game.js rock paper scissors"
  );
  process.exit(1);
}

const moves = [...new Set(args)];
if (moves.length !== args.length) {
  console.error("Error: Moves must be non-repeating.");
  process.exit(1);
}

const key = KeyGenerator.generateKey();
const computerMove = moves[Math.floor(Math.random() * moves.length)];
const hmac = HMACGenerator.generateHMAC(key, computerMove);
console.log(`HMAC: ${hmac}`);

console.log("Available moves:");
moves.forEach((move, index) => {
  console.log(`${index + 1} - ${move}`);
});
console.log("0 - exit");
console.log("? - help");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getPlayerMove = () => {
  rl.question("Enter your move: ", (input) => {
    if (input === "0") {
      console.log("Exiting...");
      rl.close();
      process.exit(0);
    } else if (input === "?") {
      const table = new HelpTable(moves);
      table.generateTable();
      getPlayerMove(); 
    } else {
      const playerMoveIndex = parseInt(input) - 1;
      if (playerMoveIndex >= 0 && playerMoveIndex < moves.length) {
        const playerMove = moves[playerMoveIndex];
        const rules = new Rules(moves);
        const result = rules.getResult(playerMove, computerMove);

        console.log(`Your move: ${playerMove}`);
        console.log(`Computer move: ${computerMove}`);
        console.log(`You ${result}!`);
        console.log(`HMAC key: ${key}`);

        rl.close();
      } else {
        console.log("Invalid choice. Try again.");
        getPlayerMove();
      }
    }
  });
};

getPlayerMove();
