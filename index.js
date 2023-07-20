const { Client } = require("skribbler");
const unpacket = require("./unpacket.js");
const fs = require("fs");


var __SILENT_TIMER__ = false
var CONNECTED = false;

var timer = async (t = 0) => {
  GAMEDATA["timer"] = t;
  GAMEDATA["timer"] -= 1;

  placeholder = ""
  if (GAMEDATA["timer"] < 0) {
    placeholder = `Awaiting next request... < 0 (${GAMEDATA["timer"]}s)`
  }

  tm = await new Promise(
    resolve => setTimeout(resolve, 1000)
  );

  // if (!CONNECTED) client = newbie();

  if (!__SILENT_TIMER__) console.log("  -- Timer: %s", placeholder || GAMEDATA["timer"]);

  timer(GAMEDATA["timer"]);

  return tm
}


function fixStdoutFor(cli) {
  var oldStdout = process.stdout;
  var newStdout = Object.create(oldStdout);
  newStdout.write = function() {
    cli._refreshLine();
    cli.output.write('\x1b[2K\r');
    var result = oldStdout.write.apply(
      this,
      Array.prototype.slice.call(arguments)
    );
    cli._refreshLine();
    return result;
  }
  process.__defineGetter__('stdout', function() { return newStdout; });
}


var readline = require("readline");
const { stdin } = require("process");


function generateCode(length = 8, includeCaps = true, includeNumbers = true) {
  let charset = 'abcdefghijklmnopqrstuvwxyz';
  if (includeCaps) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';

  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }
  return code;
}


CLI_IMP = `[CLI] `

GAMEDATA = {
  "drawing?": false,
  "drawingcooldown": false,
  "loaded?": false,
  "word": false,
  "words": false,

  "word_const?": {},
  "timer": 0,
}

_LOBBY = {}

opts = {
  "name": "Skratcher!",
  "lobbyCode": generateCode(),
}


var genmsg = (data) => {
  // Load file messages.txt
  let msgs = fs.readFileSync("messages.txt", "utf-8").split("\n");

  // Pick a random message
  let msg = msgs[Math.floor(Math.random() * msgs.length)];
  
  let damnboi = data.msg
    .replace(client.options.name, "blud")
    .replace("afk", "retarded")

  // If the data.msg is not in the file, add it
  if (!msgs.includes(damnboi)) {
    fs.appendFileSync("messages.txt", damnboi + "\n");
  }
  
  if (data.msg.startsWith("!hello")) {
    client.sendMessage(`Hello, ${data.sender}!`);
    return;
  }
}


var newbie = (optss) => {
  if (!__DO_NEXT__) return
  
  var client = new Shell(optss);
  // console.log(client)
  
  var lobbywithoutMe = []
  
  var cbr = async (a, b, c) => {
    for (let line of a.split("\n")) {
      line = line.trim();
  
      if (line != "") {
        b(line);
  
        await new Promise(
          resolve => setTimeout(resolve, c)
        );
  
      }
  
    }
  }
  
  CONNECTED = false;
  
  if (!client?.on) return newbie(optss)
  
  client.on("connected", async () => {
    
    CLI_IMP = `[CLI] ${
      JSON.stringify(Object.values(GAMEDATA?.["word_const"] || {
        err: ""
      }))
    } `;
  
    CONNECTED = true;
  
    console.log("Connected!");
  
    // console.log(client.players, client);
  
    lobbywithoutMe = client.players.filter(p => p.id != client.id);
  
    await new Promise(
      resolve => setTimeout(resolve, 1500)
    );
    client.sendMessage("HEY!")
  
  
    //   message = `Hey, I'm ${client.options.name}!
    //   I'm a test bot, and the first of my kind!
    //   I'm here to help you with your skribbling needs.
  
    //   My commands are:
    //   - !hello
  
    //   WIP, I can see every message though.
    // `
    message = ``
  
    cbr(message, ((a) => {
      client.sendMessage(a);
    }), 1500);
  
    var hints = []
  
  });

  cooldown = false;
  var msgcooldown = () => {
    if (cooldown) return;

    cooldown = true;
    setTimeout(() => {
      cooldown = false;
    }, 3000);
      
  }
  
  client.on("text", async (data) => {
    console.log(`[${data.player.name} (${data.player.score}, ${data.player.guessed ? "Won" : "Guessing"})] ${data.msg}`);
  
    let msg = genmsg(data)

    msgcooldown()
  
    if (data.player.id !== client.userId && !cooldown) client.sendMessage(msg)
  });
  
  client.on("disconnect", async (reason) => {
    console.log(new unpacket(reason), "ERROR.");
  
    CONNECTED = false;
  
    await new Promise(
      resolve => setTimeout(resolve, 1500)
    );
    
    client = newbie(optss)
  });
  
  client.on("packet", (data) => {
    // console.log(data);
    bfb = new unpacket(data);
  
    // console.log(bfb);
  
    if (
      data.id = 10
    ) {
  
      if (data?.data?.time || data?.data?.state?.time) {
        GAMEDATA['timer'] = data.data.time || data.data.state.time;
      }
  
      if (
        data?.data?.settings
        && data?.data?.users
        && data?.data?.round
        && data?.data?.state
      ) {
        _LOBBY = data;
        // console.log(_LOBBY);
      }
  
      if (data?.data?.data?.word && data?.data?.id == 4) {
        GAMEDATA["word"] = data.data.data.word;
  
        fword = ""
  
        for (var i of data.data.data.word) {
          fword += "_".repeat(i) + " "
        }
  
        GAMEDATA["word_const?"] = {
          ...fword
        }
  
        console.log(`
        
-=-=-=- GAME START -=-=-=-

-- Word: ${GAMEDATA["word"]} --

=> ${Object.values(GAMEDATA["word_const?"]).join("")}

- =-=-=-=-=-=-=-=-=-=-=- -
  
  `)
      }
  
      if (data?.data?.words && data?.data?.id == 3) {
        GAMEDATA["words"] = data.data.words;
      }
  
      if (data?.data?.scores && data?.data?.id == 5) {
        GAMEDATA["words"] = data.data.words;
      }
  
  
      if (
        Array.isArray(data.data)
        && Array.isArray(data.data[0])
        && typeof data.data[0][0] === "number"
        && typeof data.data[0][1] === "string"
      ) {
        GAMEDATA["word_const?"][data.data[0][0]] = data.data[0][1];
  
        for (var i = 0; i < data.data[0][0]; i++) {
          if (!GAMEDATA["word_const?"][i]) {
            GAMEDATA["word_const?"][i] = "_"
          }
        }
  
        console.log(`\n-- Word?: ${Object.values(GAMEDATA["word_const?"]).join("")} --\n`)
  
      }
    }
  
    // console.log(data)
    if (data.id == 19 || (data?.data?.length == 1, data?.data?.[0]?.length == 7)) {
      if (GAMEDATA["drawing?"]) clearTimeout(GAMEDATA["drawingcooldown"]);
  
      if (!GAMEDATA["drawing?"]) console.log("\n-- Drawing started! --\n");
      GAMEDATA["drawing?"] = true;
  
  
      GAMEDATA["drawingcooldown"] = setTimeout(() => {
        GAMEDATA["drawing?"] = false;
        console.log("\n-- Drawing ended! --\n");
      }, 3000);
    } else {
      // console.log(data);
      // console.log(bfb);
    }
  
    if (data?.reason == 1) {
      client = new Shell();
      CONNECTED = false;
    }
  
  });

  return client
}


class Shell {
  constructor(client) {

    let _opts = {
      "name": "Skratcher!",
      "lobbyCode": generateCode(),
    }

    this.client = new Client(client || _opts);
    this.client.client = this;
    this.__opts__ = this.client.options || _opts;
    // this.client = Object.assign(this.client, this);

    this.client.flood = this.flood;

    return this.client
  }

  async flood(id, amount = 3) {
    console.log(`
[FLOOD] Sending ${amount} messages...
    `)

    var ogaa = []
    
    var flooder = async () => {

      let _opts = {
        "name": "Skratcher!" + " " + generateCode(5, false, true),
        "lobbyCode": id,
      }
      
      // console.log("[FLOOD] /... START", _opts)

      var _cl = {}
      
      try {
        _cl = newbie(_opts)
        ogaa = 
        // console.log("[FLOOD] //.. CREATED")
      } catch (err) {
        console.log("[FLOOD] /|.. ERR")
      } 
      
      try {

        await new Promise((resolve) => {
          setTimeout(() => {
            // flooder()
            _cl.disconnect()
            resolve()
          }, 10000)
        })
        
        
      } catch (err) {
        console.log("[FLOOD] //|. ERR")
      }
      
      // await new Promise(
      //   resolve => setTimeout(resolve, 1000)
      // );
    
      // console.log("[FLOOD] //// RECURSE")

    }

    for (let i = 0; i < amount; i++) {
      await new Promise(
        resolve => setTimeout(resolve, 2000)
      );
      flooder()
    }

    // for (let i = 0; i < list.length; i++) {
    //   list[i].sendMessage(genmsg())
    // }
    
  }
}


timer()


var __DO_NEXT__ = true

var client = newbie(opts)
  
// Send message with CLI
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: CLI_IMP
});

rl.prompt(true)

process.stdin.on("data", (data) => {
  // console.clear()
  readline.clearLine(stdin, rl.line);
  rl.setPrompt(`[CLI] ${
    JSON.stringify(Object.values(GAMEDATA?.["word"]?.join ? GAMEDATA?.["word"]?.join("") : false || {
      err: "W N/A"
    }))
  } ${
    JSON.stringify(Object.values(GAMEDATA?.["words"] || {
      err: "W2 N/A"
    }))
  } ${
    JSON.stringify(Object.values(GAMEDATA?.["word_const"] || {
      err: "WC N/A"
    }))
  } `)
  rl.prompt(true)
})

fixStdoutFor(rl)

rl.on("line", async (input) => {
  rl.prompt(true)
  console.log(">  ", input)

  COMMANDS = input.trim().split(" ")
  console.log(COMMANDS)
  
  switch (COMMANDS[0]) {
    case "!plr":
      console.log(`
Players:
  - ${client.players.map(p => `${p.name} #${p.id}, Score: ${p.score}, Won?: ${p.guessed}`).join("\n  - ")}
      `);
      break;

    case "!print":
      await cbr(`
Players:
  - ${client.players.map(p => `${p.name}, Score: ${p.score}, Won?: ${p.guessed}`).join("\n  - ")}`, ((a) => {
        client.sendMessage(a)
      }), 2500);
      break;

    case "!masskick":
      console.log("Going to kick everyone!");

      for (var i of lobbywithoutMe) {
        client.votekick(i.id)
        console.log(i.id)
        await new Promise(r => setTimeout(r, 20000));
      }

      break;

    case "!!":

      client.imageVote(1)

      break;

    case "!?":

      client.imageVote(0)

      break;

    case "!>":
      __DO_NEXT__ = true
      __SILENT_TIMER__ = false
      
      let lil = COMMANDS[1]
      console.log("Flooding... ", lil)

      client.flood(COMMANDS[1], 100)
      break;

      
    case "??":
      client.disconnect()
      __DO_NEXT__ = false;
      __SILENT_TIMER__ = true
      break;


    default:
      client.sendMessage(input)
      break;
  }

});