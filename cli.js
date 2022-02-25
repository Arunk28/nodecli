const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
const e = new _events();

const cli = {};

//input handlers
e.on("stats", function (str) {
  cli.responders.stats();
});
e.on("help", function (str) {
  cli.responders.help();
});
e.on("exit", function (str) {
  cli.responders.exit();
});
//responders
cli.responders = {};

cli.responders.help = function () {
  console.log("you triggerd help command");
};
cli.responders.stats = () => {
  console.log("you triggerd stats command");
};
cli.responders.exit = () => {
  process.exit(0);
};

cli.processinput = function (str) {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;
  if (str) {
    const _inputs = ["help", "exit", "stats", "list users", "more user info"];
    let _match = false;
    _inputs.some((input) => {
      if (str.toLowerCase().indexOf(input) > -1) {
        _match = true;
        e.emit(input, str);
        return true;
      }
    });
    if (!_match) {
      console.log("Sorry, I don't understand that command.");
    }
  }
};

// this is the starting point for cli
cli.init = function () {
  console.log("cli is now running");
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "",
  });

  _interface.prompt();

  _interface.on("line", function (str) {
    cli.processinput(str);

    _interface.prompt();
  });

  _interface.on("close", function () {
    process.exit(0);
  });
};

module.exports = cli;
