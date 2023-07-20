// const events = require("events");

// class engine extends events {
//   constructor(options) {
//     super();
// }

/** Structure of packets used for prop reflection
  * * e.g. 
      used to quickly construct a Packet object
  * * 
  */
var schemas = {
  
  "msg": {
    id: 0,
    data: {
      id: 0,
      msg: ""
    },
  },

  "clientjoin": {
    id: 0,
    data: {
      settings: [],
      id: '',
      type: '',
      me: '',
      owner: '',
      users: [],
      round: 0,
      state: { id: 0, time: 0, data: [] }
    }
  },

  "match_end": {
    id: 0,
    data: {
      id: 0,
      time: 0,
      data: []
    }
  },
  
  "join": {
    id: 0,
    data: {
      id: 0,
      name: '',
      avatar: [],
      score: 0,
      guessed: false,
      flags: 0
    }
  },

  "kicked": {
    reason: 0,
    joinErr: 0
  },

  "left": {
    id: 0,
    data: {
      id: 0, reason: 0 
    } 
  },

  "prepare_for_words": {
    id: 0,
    data: {
      id: 2, time: 2, data: 0 
    } 
  },

  "round_done": {
    id: 0,
    data: {
      id: 5,
      time: 0,
      data: { reason: 1, word: '', scores: [] }
    }
  },

  "round_start": {
    id: 10,
    data: {
      id: 4,
      time: 0,
      data: { id: 0, word: [], hints: [], drawCommands: [] }
    }
  }
  
  // "draw": {
  //   id: 0,
  //   data: []
  // }
  
}



function getAllKeys(obj, keys = new Set()) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.add(key);
     
      if (typeof obj[key] == 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        getAllKeys(obj[key], keys);
      }
    
    }
  }
  return keys;
}

function hasSameKeyStructure(obj1, obj2) {
  const keys1 = getAllKeys(obj1);
  const keys2 = getAllKeys(obj2);

  if (keys1.size !== keys2.size) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.has(key)) {
      return false;
    }
  }

  return true;
}

function deepQuil(obj1, obj2, opts) {
  opts = opts || {};

  
}


class Chat {
  constructor(client) {
    this.client = client;
    this.chat = [];
  }
  
  msg(msg) {
    this.chat.push({
      id: this.client.id,
      data: {
        id: this.client.id,
        msg: msg
      }
    });
    
    // this.client.sendMessage(JSON.stringify(this.chat));
  }
}




class Message {
  constructor(data) {
    this.pid = data.data?.id;
    this.data = data.data;
    this.type = "msg";
    this.schema = schemas.msg;
  }

  send(client) {
    client.sendMessage(this);
  }

  static from(data) {
    return new Message(data);
  }
}



class Packet {
  constructor(data) {
    this.data = data;
    this.type = "basic";

    // console.log(this.data);
    
    _do: for (var i in schemas) {
      if (hasSameKeyStructure(schemas[i], this.data) && !this.data?.data?.[0]) {
        console.log(`
-----${"-".repeat(i.length)}-${"-".repeat(`${this.data} `.length)}
Got: ${i}, ${JSON.stringify(this.data, null, 2)}
-----${"-".repeat(i.length)}-${"-".repeat(`${this.data} `.length)}
`);
      }
      
    }

    if (this.data.id == 10) {
      this.type = "data";

      if (this.data?.data?.msg) {
        this.type = "msg";
        this.msg = Message.from(this.data.data.msg);
      }

      if (this.data?.data?.name || this.data?.data?.settings) {
        
        // console.log();
      }
    }
    
    if (this.data.id == 30) {
      this.type = "msg";
      this.msg = Message.from(this.data.data.msg);
    }
    
    if (this.data.id == 19) {
      this.type = "draw";
    }

    if (this.data?.data?.id == 4) {
      this.type = "start_round";
    }
    
    if (this.data?.data?.id == 5) {
      this.type = "end_round";
    }
    
    if (this.data?.data?.id == 6) {
      this.type = "end_match";
    }
    
    
    if (
      hasSameKeyStructure(this.data, schemas["msg"])
    ) {
      console.log(`
GOT MSG!
      `)
    }
    
    if (
      hasSameKeyStructure(this.data, schemas["join"])
    ) {
      console.log(`
GOT JOIN!
      `)
    }

    // return data
  }
  
  typeobj(obje) {
    var obj = {};

    Object.defineProperties(obj, Object.getOwnPropertyDescriptors(obje)); 
    
    for (let key in obje) {
      if (Array.isArray(obje[key])) {
        obj[key] = Object.values(this.typeobj(obje[key]));
        continue
      }
      
      // If obj, recurse. Else, return type.
      if (typeof obje[key] == "object") {
        obj[key] = this.typeobj(obje[key]);
        continue
      }
      
      obj[key] = typeof obje[key];
      // console.log(key, obj[key])
    }
    
      // console.log(obj)
    return obj;
  }
}



module.exports =
  Packet