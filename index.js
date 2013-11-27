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
function scrollTo(x, y) {
    io.sockets.emit('scrollTo', { x:x , y:y });
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

// utility

function saveConfig() {
    var config = {
        servos: []
    };
    servos.forEach(function(servo) {
        config.servos.push({
            pin: servo.pin,
            landscape: servo.landscape,
            portrait: servo.portrait,
            landscapeRight: servo.landscapeRight,
        });
    });
    var fs = require('fs');
    fs.writeFile(__dirname + "/config.json", JSON.stringify(config, null, '  '), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("saved!");
        }
    });
}

var config = require(__dirname + '/config.json');

if (true) { // TODO: command line flag

    // repl interface
    var repl = require("repl");
    var session = repl.start({
        prompt: "moblab > ",
        input: process.stdin,
        output: process.stdout,
    });
    session.on('exit', function () {
        process.exit();
    });

    // expose commands to repl
    session.context.go = go;
    session.context.reload = reload;
    session.context.scrollTo = scrollTo;

} else {

    // setup arduino servos
    var five = require('johnny-five');
    var board = new five.Board();

    board.on("ready", function() {
        var servo1 = new five.Servo(12);
        var servo2 = new five.Servo(11);
        var servo3 = new five.Servo(10);
        var servo4 = new five.Servo(9);
        servos.push(servo1);
        servos.push(servo2);
        servos.push(servo3);
        servos.push(servo4);

        servos.forEach(function(servo) {
            config.servos.forEach(function(servoConfig) {
                if (servo.pin === servoConfig.pin) {
                    servo.landscape = servoConfig.landscape;
                    servo.portrait = servoConfig.portrait;
                    servo.landscapeRight = servoConfig.landscapeRight;
                }
            });
        });

        portrait();

        board.repl.inject({
            servo1: servo1,
            servo2: servo2,
            servo3: servo3,
            servo4: servo4,
            saveConfig: saveConfig,
            go: go,
            reload: reload,
            scrollTo: scrollTo,
            portrait: portrait,
            landscape: landscape,
            landscapeRight: landscapeRight,
        });
    });

}
