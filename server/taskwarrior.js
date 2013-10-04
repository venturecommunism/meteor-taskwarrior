////////////////////////////////// preliminaries ////////////////////////////////////////////
// some required NPM packages
var forge = Meteor.require('node-forge')
  , net = Meteor.require('net')
;

//replace with your task server's ip
var taskserver = '127.0.0.1'
//replace with your task server's port (default 6544)
var port = 6544
//replace org with your user's organization e.g. Public
var org = 'Public'
//replace user with your user e.g. USER
var user = 'USER'
//replace key with your user's key e.g. ddea9923-fgg3-3922-c958-23cgdeaa0584
var key = 'ddea9923-fgg3-3922-c958-23cgdeaa0584'

var myClientPrivateKey = ''

Meteor.methods({
  tlstest: function () {
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
    var wholeMessage = part1 + part2 + newline + part3 + org + newline + part5 + user + newline + part7 + key + newline + part9 + part10 + newline + part11 + part12 + newline + newline
    var buffermessage = forge.util.createBuffer(wholeMessage, 'utf8');
    var buffer = forge.util.createBuffer();
    buffer.putInt32(buffermessage.length() + 4);
    var hex = buffer.toHex();
    client.prepare(forge.util.hexToBytes(hex))
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
    console.log('[tls] data received from the server: ' + data);
  },
  closed: function() {
    console.log('[tls] disconnected');
  },
  error: function(connection, error) {
    console.log('[tls] error', error);
  }
});

//console.log('dataholder is ' + dataholder)

socket.on('connect', function() {
  console.log('[socket] connected');
  client.handshake();
});
socket.on('data', function(data) {
  client.process(data.toString('binary')); // encoding should be 'binary'
});
socket.on('end', function() {
  console.log('[socket] disconnected');
});

// connect to task server
socket.connect(port, taskserver);

}
})

