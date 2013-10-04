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
//replace key with your client.key.pem (note the newlines, plus signs and single quotations)
var myClientPrivateKey =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIEpAIBAAKCAQEAzWSJl+Z9Bqv00FVL5N3+JCUoqmQPjIlya1BbeqQroNQ5yG1i\n' +
  'VbYTTnMRa1zQtR6r2fNvWeg94DvxivxIG9diDMnrzijAnYlTLOl84CK2vOxkj5b6\n' +
  '8zrLH9b/Gd6NOHsywo8IjvXvCeTfca5WUHcuVi2lT9VjygFs1ILG4RyeX1BXUumu\n' +
  'Y8fzmposxLYdMxCqUTzAn0u9Saq2H2OVj5u114wS7OQPigu6G99dpn/iPHa3zBm8\n' +
  '7baBWDbqZWRW0BP3K6eqq8sut1+NLhNW8ADPTdnO/SO+kvXy7fqd8atSn+HlQcx6\n' +
  'tW42dhXf3E9uE7K78eZtW0KvfyNGAjsI1Fft2QIDAQABAoIBAG1exe3/LEBrPLfb\n' +
  'U8iRdY0lxFvHYIhDgIwohC3wUdMYb5SMurpNdEZn+7Sh/fkUVgp/GKJViu1mvh52\n' +
  'bKd2r52DwG9NQBQjVgkqY/auRYSglIPpr8PpYNSZlcneunCDGeqEY9hMmXc5Ssqs\n' +
  'PQYoEKKPN+IlDTg6PguDgAfLR4IUvt9KXVvmB/SSgV9tSeTy35LECt1Lq3ozbUgu\n' +
  '30HZI3U6/7H+X22Pxxf8vzBtzkg5rRCLgv+OeNPo16xMnqbutt4TeqEkxRv5rtOo\n' +
  '/A1i9khBeki0OJAFJsE82qnaSZodaRsxic59VnN8sWBwEKAt87tEu5A3K3j4XSDU\n' +
  '/avZxAECgYEA+pS3DvpiQLtHlaO3nAH6MxHRrREOARXWRDe5nUQuUNpS1xq9wte6\n' +
  'DkFtba0UCvDLic08xvReTCbo9kH0y6zEy3zMpZuJlKbcWCkZf4S5miYPI0RTZtF8\n' +
  'yps6hWqzYFSiO9hMYws9k4OJLxX0x3sLK7iNZ32ujcSrkPBSiBr0gxkCgYEA0dWl\n' +
  '637K41AJ/zy0FP0syq+r4eIkfqv+/t6y2aQVUBvxJYrj9ci6XHBqoxpDV8lufVYj\n' +
  'fUAfeI9/MZaWvQJRbnYLre0I6PJfLuCBIL5eflO77BGso165AF7QJZ+fwtgKv3zv\n' +
  'ZX75eudCSS/cFo0po9hlbcLMT4B82zEkgT8E2MECgYEAnz+3/wrdOmpLGiyL2dff\n' +
  '3GjsqmJ2VfY8z+niSrI0BSpbD11tT9Ct67VlCBjA7hsOH6uRfpd6/kaUMzzDiFVq\n' +
  'VDAiFvV8QD6zNkwYalQ9aFvbrvwTTPrBpjl0vamMCiJ/YC0cjq1sGr2zh3sar1Ph\n' +
  'S43kP+s97dcZeelhaiJHVrECgYEAsx61q/loJ/LDFeYzs1cLTVn4V7I7hQY9fkOM\n' +
  'WM0AhInVqD6PqdfXfeFYpjJdGisQ7l0BnoGGW9vir+nkcyPvb2PFRIr6+B8tsU5j\n' +
  '7BeVgjDoUfQkcrEBK5fEBtnj/ud9BUkY8oMZZBjVNLRuI7IMwZiPvMp0rcj4zAN/\n' +
  'LfUlpgECgYArBvFcBxSkNAzR3Rtteud1YDboSKluRM37Ey5plrn4BS0DD0jm++aD\n' +
  '0pG2Hsik000hibw92lCkzvvBVAqF8BuAcnPlAeYfsOaa97PGEjSKEN5bJVWZ9/om\n' +
  '9FV1axotRN2XWlwrhixZLEaagkREXhgQc540FS5O8IaI2Vpa80Atzg==\n' +
  '-----END RSA PRIVATE KEY-----'

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

