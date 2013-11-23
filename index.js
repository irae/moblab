'use strict';

var http = require('http');
var sockjs = require('sockjs');
var prompt = require('cli-prompt');

var static_server = require('./static/index.js');
var connections = [];

var echo = sockjs.createServer({
    log: function() {}
});
echo.on('connection', function(conn) {
    conn.on('data', function(message) {
        // console.log(message);
    });
    conn.on('close', function () {
        connections.splice(connections.indexOf(conn), 1);
    });
    connections.push(conn);
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/moblab'});
server.listen(3582, '0.0.0.0');
static_server.listen(3581, '0.0.0.0');

function commandPrompt () {
    prompt(' moblab > ', function (command) {
        connections.forEach(function (conn) {
            conn.end(command);
        });
        setTimeout(commandPrompt, 10);
    });
}
commandPrompt();
