'use strict';

var master = require('./mob.master');

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

// utility
var config = {};
try { config = require(__dirname + '/config.json'); } catch(e) {}
config.servos = config.servos || [];

function saveConfig() {
    config.servos = [];
    servos.forEach(function(servo) {
        config.servos.push({
            pin: servo.pin,
            landscape: servo.landscape,
            portrait: servo.portrait
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

// setup arduino servos
var five = require('johnny-five');
var board = new five.Board();

board.on("ready", function() {
    var servo1 = new five.Servo(10);
    var servo2 = new five.Servo(9);
    var servo3 = new five.Servo(6);
    var servo4 = new five.Servo(5);
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
        go: master.go,
        reload: master.reload,
        scrollTo: master.scrollTo,
        portrait: portrait,
        landscape: landscape,
    });
});

