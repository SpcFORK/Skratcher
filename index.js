const { Client } = require("skribbler");


class Shell {
  constructor(client = new Client({ name: "Skratcher" })) {
    this.client = client;
    this.client = Object.assign(this.client, this);
    
    return this.client
  }
  
  async flood(amount) {
    
  }
}


var client = new Shell();


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

client.on("connected", async () => {
CONNECTED = true;
  
	console.log("Connected!");

  console.log(client.players, client);

  await new Promise(
    resolve => setTimeout(resolve, 1500)
  );

  
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

client.on("text", (data) => {
	console.log(`[${data.player.name} (${data.player.score}, ${data.player.guessed ? "Won" : "Guessing"}, Flags: ${data.player.flags})] ${data.msg}`);
  
  if (data.msg.startsWith("!hello")) {
    client.sendMessage(`Hello, ${data.sender}!`);
    return;
  }
});

client.on("disconnect", (reason) => {
	console.log(reason, "ERROR.");

  CONNECTED = false;
  
  client = new Shell();
});

// client.catcher[]

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

  if (client.socket) client = new Shell();
  
  console.log("  -- Timer: %s", placeholder || GAMEDATA["timer"]);

  timer(GAMEDATA["timer"]);
  
  return tm
}

timer()

client.gameData = async (data) => {

  if (
    data.id = 10
  ) {

    if (data?.data?.time) {
      GAMEDATA['timer'] = data.data.time;
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
    console.log(data)
  }

  if (data?.reason == 1) {
    client = new Shell();
    CONNECTED = false;
  }
  
}

// Send message with CLI

var readline = require("readline");
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", async (input) => {
  switch(input.trim()) {
    case "!plr":
      console.log(`
Players:
  - ${client.players.map(p => `${p.name} #${p.id}, Score: ${p.score}, Won?: ${p.guessed}`).join("\n  - ")}
      `);
      break;

    case "!print":
      await cbr(`
Players:
  - ${client.players.map(p => `${p.name}, Score: ${p.score}, Won?: ${p.guessed}`).join("\n  - ")}`, ((a)=>{
        client.sendMessage(a)
      }), 2500);
      break;
      
    default:
      client.sendMessage(input)
      break;

    case "!masskick":
      
      for (var i of client.players) {
        client.votekick(i.id)
        console.log(i.id)
        await new Promise(r => setTimeout(r, 10000));
      }
      
      break;

  }
  
});