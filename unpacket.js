// const events = require("events");

// class engine extends events {
//   constructor(options) {
//     super();
// }

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

// Object.prototype.sameStructureAs = function(obj) {
//   if (Object.keys(this).length !== Object.keys(obj).length) {
//     return false;
//   }

//   if (Object.keys(this) != Object.keys(obj)) {
//     return false;
//   }

//   return true;
// };
  
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

  "draw": {
    id: 0,
    data: []
  }
  
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


// function compareObjects(obj1, obj2) {
//   // Helper function to check if the input is an object (excluding arrays)
//   function isObject(obj) {
//     return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
//   }

//   // Check if both inputs are objects
//   if (!isObject(obj1) || !isObject(obj2)) {
//     return false;
//   }

//   // Get the keys of both objects
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);

//   // Check if they have the same number of keys
//   if (keys1.length !== keys2.length) {
//     return false;
//   }

//   // Check if all keys in obj1 are present in obj2 and vice versa
//   if (!keys1.every(key => keys2.includes(key)) || !keys2.every(key => keys1.includes(key))) {
//     return false;
//   }

//   // Recursively compare the values of corresponding keys
//   for (const key of keys1) {
//     const value1 = obj1[key];
//     const value2 = obj2[key];

//     // If both values are objects, recursively compare them
//     if (isObject(value1) && isObject(value2)) {
//       if (!compareObjects(value1, value2)) {
//         return false;
//       }
//     }
//     // If one of the values is not an object, compare their types
//     else if (typeof value1 !== typeof value2) {
//       return false;
//     }
//   }

//   return true;
// }



class Packet {
  constructor(data) {
    this.data = data;
    this.type = "basic";

    // console.log(this.data);
    
    _do: for (var i in schemas) {
      if (hasSameKeyStructure(schemas[i], this.data) && !this.data.data[0]) {
        console.log(`
-----${"-".repeat(i.length)}-${"-".repeat(`${this.data} `.length)}
Got: ${i}, ${this.data}
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