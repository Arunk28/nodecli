const readline = require("readline");
const util = require("util");
const debug = util.debuglog("cli");
const events = require("events");
class _events extends events {}
const e = new _events();
const _data = require("./data");

const os = require("os");

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
e.on("listusers", function (str) {
  cli.responders.listusers();
});
//responders
cli.responders = {};

cli.responders.stats = () => {
  const _stats = {
    "cpu count": os.cpus().length,
    "free memory": os.freemem(),
  };
  cli.harizontalline();
  cli.centerd("COMPUTER STATUS");
  cli.harizontalline();
  cli.verticalspace(2);

  //show each command
  for (let key in _stats) {
    if (_stats.hasOwnProperty(key)) {
      const value = _stats[key];
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalspace();
    }
  }
  cli.verticalspace(1);

  // end with a line
  cli.harizontalline();
};

cli.responders.help = function () {
  const _help = {
    exit: "exit the code",
    stats: "status bar",
    listusers: "list the users --user",
    moreuserinfo: "--userid for more info",
  };
  cli.harizontalline();
  cli.centerd("CLI MANUAL");
  cli.harizontalline();
  cli.verticalspace(2);

  //show each command
  for (let key in _help) {
    if (_help.hasOwnProperty(key)) {
      const value = _help[key];
      //more colours you can set
      //see = https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
      let line = `\x1b[33m${key}\x1b[0m`;
      const padding = 60 - line.length;
      for (let i = 0; i < padding; i++) {
        line += " ";
      }
      line += value;
      console.log(line);
      cli.verticalspace();
    }
  }
  cli.verticalspace(1);

  // end with a line
  cli.harizontalline();
};

cli.verticalspace = (lines) => {
  lines = typeof lines == "number" && lines > 0 ? lines : 1;
  for (let i = 0; i < lines; i++) {
    console.log("");
  }
};
cli.harizontalline = () => {
  const width = process.stdout.columns;
  let line = "";
  for (let i = 0; i < width; i++) {
    line += "-";
  }
  console.log(line);
};

cli.centerd = (str) => {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : "";

  const width = process.stdout.columns;

  const leftPadding = Math.floor((width - str.length) / 2);

  let line = "";

  for (let i = 0; i < leftPadding; i++) {
    line += " ";
  }
  line += str;
  console.log(line);
};

cli.responders.exit = () => {
  process.exit(0);
};

cli.responders.listusers = () => {
  cli.verticalspace();
  _data.users.forEach((user) => {
    const line = `user : ${user}`;
    console.log(line);
  });
};

cli.processinput = function (str) {
  str = typeof str === "string" && str.trim().length > 0 ? str.trim() : false;
  if (str) {
    const _inputs = ["help", "exit", "stats", "listusers", "moreuserinfo"];
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
