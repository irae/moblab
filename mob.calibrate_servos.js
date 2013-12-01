'use strict';
var configLib = require('./lib/config');
var config = configLib.load();
var inquirer = require("inquirer");

var five = require('johnny-five');
var board = new five.Board({
    repl: false
});

board.on("ready", function() {
    var servos = [];
    var portraitQuestions = [];
    var landscapeQuestions = [];
    config.servos.forEach(function(servoConfig) {
        var servo = new five.Servo(servoConfig.pin);
        servo.landscape = servoConfig.landscape || 150;
        servo.portrait = servoConfig.portrait || 70;
        servos.push(servo);
        portraitQuestions.push({
            type: 'input',
            name: 'portrait' + servo.pin,
            message: 'Portrait for servo at pin ' + servo.pin +': type a number or type "ok" to save in current position.',
            validate: function(input) {
                if (input === 'ok' || input === 'yes') {
                    return true;
                } else {
                    input = parseInt(input, 10);
                    if (!isNaN(input) && input >= 0) {
                        servo.portrait = input;
                        servo.move(input);
                        return 'Moved to ' + input +'. Is this ok now?';
                    } else {
                        return 'Invalid input. Use a number, "ok" or "yes"';
                    }
                }
            },
        });
        landscapeQuestions.push({
            type: 'input',
            name: 'landscape' + servo.pin,
            message: 'Landscape for servo at pin ' + servo.pin +': type a number or type "ok" to save in current position.',
            validate: function(input) {
                if (input === 'ok' || input === 'yes') {
                    return true;
                } else {
                    input = parseInt(input, 10);
                    if (!isNaN(input) && input >= 0) {
                        servo.landscape = input;
                        servo.move(input);
                        return 'Moved to ' + input +'. Is this ok now?';
                    } else {
                        return 'Invalid input. Use a number, "ok" or "yes"';
                    }
                }
            },
        });
    });
    servos.forEach(function(servo) {
        servo.move(servo.portrait);
    });
    inquirer.prompt(portraitQuestions, function() {
        servos.forEach(function(servo) {
            servo.move(servo.landscape);
        });
        inquirer.prompt(landscapeQuestions, function() {
            config.servos = [];
            servos.forEach(function(servo) {
                config.servos.push({
                    pin: servo.pin,
                    landscape: servo.landscape,
                    portrait: servo.portrait
                });
            });
            configLib.save(config, function() {
                process.exit(0);
            });
        });
    });

});

