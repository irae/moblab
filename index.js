'use strict';

// setup static server and socket.io for browsers
var static_server = require('./static/index.js');
var io = require('socket.io').listen(static_server);
io.set('heartbeat interval', 2000);
io.set('heartbeat timeout', 6000);
io.set('log level', 1);

static_server.listen(3582, '0.0.0.0');

// commands to the browsers
function reload() {
    io.sockets.emit('reload');
}
function go(url) {
    var http = 'http://';
    if (url.indexOf(http) !== 0) {
        url = http + url;
    }
    io.sockets.emit('go', url);
}

// commands to the robots
var servos = [];
function portrait() {
    servos.forEach(function(servo) {
        servo.move(servo.portrait||90);
    });
}
function landscape() {
    servos.forEach(function(servo) {
        servo.move(servo.landscape||150);
    });
}
function landscapeRight() {
    servos.forEach(function(servo) {
        servo.move(servo.landscapeRight||30);
    });
}

// setup arduino servos
var five = require('johnny-five');
var board = new five.Board();

board.on("ready", function() {
    var servo1 = new five.Servo(10);
    var servo2 = new five.Servo(11);
    servos.push(servo1);
    servos.push(servo2);

    board.repl.inject({
        servo1: servo1,
        servo2: servo2,
        go: go,
        reload: reload,
        portrait: portrait,
        landscape: landscape,
        landscapeRight: landscapeRight,
    });
});

