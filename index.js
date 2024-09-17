const readline = require("readline");
const KeyGenerator = require("./key-generator");
const HMACGenerator = require("./HMAC-generator");
const Rules = require("./rules");
const HelpTable = require("./help-table");

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
    } else if (
      !isNaN(input) &&
      parseInt(input) > 0 &&
      parseInt(input) <= moves.length
    ) {
      const playerMoveIndex = parseInt(input) - 1;
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
  });
};

getPlayerMove();
