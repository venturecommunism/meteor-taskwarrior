////////////////////////////////// preliminaries ////////////////////////////////////////////
// some required NPM packages
var forge = Meteor.require('node-forge')
  , net = Meteor.require('net')
;

bigdata = ''

function adminUser(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return (userId && adminUser && userId === adminUser._id);
}

Tasks.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  }
});

Taskspending.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  }
});

Tasksbacklog.allow({
  insert: function(userId, doc){
    return (adminUser (userId) || (userId && doc.owner === userId));
  },
  update: function (userId, docs, fields, modifier){
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  },
  remove: function (userId, docs){
    return _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  }
});


Meteor.publish("tasks", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Tasks.find()
  }
});

Meteor.publish("taskspending", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Taskspending.find()
  }
});

Meteor.publish("tasksbacklog", function () {
  var userId = this.userId
  if (adminUser(userId)) {
    return Tasksbacklog.find()
  }
});

Meteor.methods({
  sync: function () {
  var socket = new net.Socket();

  var client = forge.tls.createConnection({
  server: false,
  cipherSuites: [
    forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
    forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
  verify: function(connection, verified, depth, certs) {
    // skip verification for testing
    console.log('[tls] server certificate verified');
    return true;
  },
  connected: function(connection) {
    console.log('[tls] connected');
    // prepare some data to send
    var newline = '\n'
    var part1 = 'type: '
    var part2 = 'sync'
    var part3 = 'org: '
    var part5 = 'user: '
    var part7 = 'key: '
    var part9 = 'client: '
    var part10 = 'collectiveaction 1.0beta'
    var part11 = 'protocol: '
    var part12 = 'v1'
    var synckey = Tasks.findOne({ synckey : {$exists: 1}}).synckey
    wholeMessage = ''
    if (synckey != null) {
      wholeMessage = part1 + part2 + newline + part3 + org + newline + part5 + user + newline + part7 + key + newline + part9 + part10 + newline + part11 + part12 + newline + newline + synckey + newline
      if (Tasksbacklog.find() != null) {
         var payload = Tasksbacklog.find()
         payload.forEach(function (task) {
           delete task._id
           wholeMessage += JSON.stringify(task) + '\n'
         })
       }
    } else {
      wholeMessage = part1 + part2 + newline + part3 + org + newline + part5 + user + newline + part7 + key + newline + part9 + part10 + newline + part11 + part12 + newline + newline
    }
    var buffermessage = forge.util.createBuffer(wholeMessage, 'utf8');
    var buffer = forge.util.createBuffer();
    buffer.putInt32(buffermessage.length() + 4);
    client.prepare(buffer.getBytes())
    client.prepare(wholeMessage);
  },
  getPrivateKey: function(connection, cert) {
    return myClientPrivateKey;
  },
  tlsDataReady: function(connection) {
    // encrypted data is ready to be sent to the server
    var data = connection.tlsData.getBytes();
    socket.write(data, 'binary'); // encoding should be 'binary'
  },
  dataReady: function(connection) {
    // clear data from the server is ready
    var data = connection.data.getBytes();
    bigdata += data
  },
  closed: function() {
    console.log('[tls] disconnected');
    var data = bigdata
    var dataslice = data.slice(0,4)
    var hex = forge.util.bytesToHex(dataslice)
    var decimal = parseInt(hex, 16)
    var mainData = data.split(dataslice)
    console.log('decimal is ' + decimal)
    var line = mainData[1].split('\n')
    var newline = '\n'
    var linetosplit = line[0] + newline + line[1] + newline + line[2] + newline + newline
    var taskdata = mainData[1].replace(linetosplit,'')
    console.log('taskdata is ' + taskdata)
    var tasklines = taskdata.split('\n')
    var synckeynum = tasklines.length - 3
    console.log('tasklines.length is ' + tasklines.length + ' and the sync key is ' + tasklines[synckeynum])
    for (var i=0; i < synckeynum; i++) {
      var parsedtask = JSON.parse(tasklines[i])
      console.log('i is ' + i + ' and synckeynum is ' + synckeynum)
      console.log(tasklines[i])
      console.log('blooppeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      if (Tasks.find(parsedtask) == null) {
        Tasks.insert(parsedtask)
      }
      console.log('wuuuuuuuuuuuuuuuuud')

//      Taskspending.upsert({uuid: parsedtask.uuid}, parsedtask)

      console.log('parsedtask is ' + JSON.stringify(parsedtask))
      console.log('taskspending findone ' + Taskspending.findOne({uuid: parsedtask.uuid}))
      if (Taskspending.findOne({uuid: parsedtask.uuid}) != null) {
        console.log('updated ' + parsedtask.uuid)
        Taskspending.update({uuid: parsedtask.uuid}, {$set: JSON.stringify(parsedtask)})
      }
      else {
        console.log('inserted ' + parsedtask)
        Taskspending.insert(parsedtask)
      }


    }
    console.log('synckey is ' + tasklines[synckeynum])
    Tasks.upsert({synckey: {$exists: 1}}, {synckey: tasklines[synckeynum]})
    // have to make sure to only remove backlog on success
    Tasksbacklog.remove({})
    bigdata = ''
  },
  error: function(connection, error) {
    console.log('[tls] error', error);
  }
});

socket.on('connect', function() {
  console.log('[socket] connected');
  client.handshake();
});

socket.on('data', Meteor.bindEnvironment(function(data) {
  client.process(data.toString('binary')); // encoding should be 'binary'
}, function(e) {
  console.log(e);
}));


socket.on('end', Meteor.bindEnvironment(function() {
  console.log('[socket] disconnected');
}, function (e) {
  console.log(e);
}));

// connect to task server
socket.connect(port, taskserver);


}
})

