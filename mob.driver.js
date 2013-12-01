'use strict';

// setup static server and socket.io for browsers
var static_server = require('./lib/static_index');
var io = require('socket.io').listen(static_server);
// io.set('heartbeat interval', 2 * 1000);
// io.set('heartbeat timeout', 2.1 * 1000);
io.set('log level', 1);

var client_channel = io.of('/client');
var master_channel = io.of('/master');

master_channel.on('connection', function(master) {
    console.log('master connection');
    var $emit = master.$emit;
    master.$emit = function(event) {
        if (/^(disconnect|message|connection|error|end|close)$/.test(event)) {
            return;
        }
        for (var socket in client_channel.sockets) {
            if (client_channel.sockets.hasOwnProperty(socket)) {
                client_channel.sockets[socket].emit.apply(client_channel.sockets[socket], arguments);
            }
        }
    };
});

client_channel.on('connection', function(client) {
    console.log('client connection');
    client.on('newclient', function(client_info) {
        console.log('client_info', client_info);
    });
});

static_server.listen(3582, '0.0.0.0');
console.log('MobLab Driver listening on 0.0.0.0:3582');
