'use strict';

var config = require('./lib/config').load();

// commands to the robots
var servos = [];
function portrait() {
    servos.forEach(function(servo) {
        servo.move(servo.portrait||70);
    });
}
function landscape() {
    servos.forEach(function(servo) {
        servo.move(servo.landscape||150);
    });
}

// setup arduino servos
var five = require('johnny-five');
var board = new five.Board();

board.on("ready", function() {
    var replEnv = {
        portrait: portrait,
        landscape: landscape,
    };

    config.servos.forEach(function(servoConfig, index) {
        var servo = new five.Servo(servoConfig.pin);
        servo.landscape = servoConfig.landscape;
        servo.portrait = servoConfig.portrait;
        servos.push(servo);
        replEnv['servo'+index] = servo;
    });

    board.repl.inject(replEnv);

    portrait();
});

