'use strict';

var prompt = require('cli-prompt');
var static_server = require('./static/index.js');
var io = require('socket.io').listen(static_server);

io.on('connection', function(socket) {
    // initial event
    socket.on('newclient', function(message) {
        // console.log('new client at: ' + message.url);
    });
});
io.set('heartbeat interval', 2000);
io.set('heartbeat timeout', 6000);
io.set('log level', 1);

static_server.listen(3582, '0.0.0.0');

function commandPrompt () {
    prompt(' moblab > ', function (command) {
        if (command === 'reload') {
            io.sockets.emit('reload');
        }
        var go = 'go ';
        var http = 'http://';
        if (command.indexOf(go) === 0) {
            var url = command.substr(go.length);
            if (url.indexOf(http) !== 0) {
                url = http + url;
            }
            io.sockets.emit('go', url);
        }
        setTimeout(commandPrompt, 500);
    });
}
commandPrompt();
