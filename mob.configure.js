'use strict';

var inquirer = require("inquirer");
var config = require('./lib/config');
var newConfig = config.load(true); // don't use load(true) outside mob.configure.js
newConfig.servos = newConfig.servos || [];

function servoPrompt(callback) {
    console.log('\nyou have ' + newConfig.servos.length + ' servos configured');
    inquirer.prompt([{
        type: 'confirm',
        name: 'add',
        default: false,
        message: 'Do you want to '+ (newConfig.servos.length ? 'another': 'add') + ' a servo?'
    }], function( answers ) {
        if (answers.add) {
            addServo(callback);
        } else {
            callback && callback();
        }
    });
}

function addServo(callback) {
    inquirer.prompt([{
        type: 'input',
        name: 'pin',
        message: 'On which pin is this servo?',
        validate: function(input) {
            input = parseInt(input, 10);
            if (!isNaN(input) && input >= 0) {
                return true;
            } else {
                return 'invalid pin number';
            }
        },
    }], function( answers ) {
        newConfig.servos.push({
            pin: answers.pin
        });
        servoPrompt(callback);
    });
}

function removeServosPrompt(callback) {
    console.log('\nyou have ' + newConfig.servos.length + ' servos configured');
    inquirer.prompt([{
        type: 'confirm',
        name: 'remove',
        default: false,
        message: 'Do you want remove some?'
    }], function( answers ) {
        if (answers.remove) {
            removeServos(callback);
        } else {
            callback && callback();
        }
    });
}

function removeServos(callback) {
    inquirer.prompt([{
        type: 'checkbox',
        name: 'excluded',
        choices: function() {
            return newConfig.servos.map(function(servo) {
                return {
                    name: 'servo on pin ' + servo.pin,
                    value: servo.pin,
                };
            });
        },
        message: 'Select which servos to remove',
    }], function( answers ) {
        console.log(answers);
        answers.excluded.forEach(function(removedPin) {
            var removedServo = newConfig.servos.filter(function(servo) {
                return removedPin === servo.pin;
            })[0];
            newConfig.servos.splice(newConfig.servos.indexOf(removedServo), 1);
        });
        console.log(newConfig);
        callback && callback();
    });

}

if (newConfig.servos.length) {
    removeServosPrompt(function() {
        servoPrompt(function() {
            config.save(newConfig, function() {
                console.log('now run `node mob.calibrate_servos.js` if you want to calibrate them!');
            });
        });
    });
} else {
    servoPrompt(function() {
        config.save(newConfig, function() {
            console.log('now run `node mob.calibrate_servos.js` if you want to calibrate them!');
        });
    });
}

