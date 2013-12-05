'use strict';

var config = require('./lib/config');
var fs = require('fs');
var inquirer = require("inquirer");
var newConfig = config.load(true); // don't use load(true) outside mob.configure.js
newConfig.servos = newConfig.servos || [];

function numberValidation(input) {
    input = parseInt(input, 10);
    if (!isNaN(input) && input >= 0) {
        return true;
    } else {
        return 'Expecting a number';
    }
}

function hostsAndPortsQuestions(callback) {
    inquirer.prompt([{
        type: 'input',
        name: 'proxyHostname',
        default: newConfig.proxyHostname || require('os').hostname(),
        message: 'What hostname do you want to use for the **proxy** ?'
    },{
        type: 'input',
        name: 'proxyPort',
        default: newConfig.proxyPort || 8581,
        message: 'What port do you want to use for the **proxy** ?',
        validate: numberValidation,
    },{
        type: 'input',
        name: 'driverHostname',
        default: newConfig.driverHostname || require('os').hostname(),
        message: 'What hostname do you want to use for the **dirver** ?'
    },{
        type: 'input',
        name: 'driverPort',
        default: newConfig.driverPort || 3581,
        message: 'What port do you want to use for the **dirver** ?',
        validate: numberValidation,
    }], function( answers ) {
        newConfig.proxyHostname = answers.proxyHostname;
        newConfig.driverHostname = answers.driverHostname;
        newConfig.driverPort = answers.driverPort;
        newConfig.proxyPort = answers.proxyPort;
        var proxyTemplate = __dirname + '/static/proxy-example.pac';
        var proxyOut = __dirname + '/static/proxy.pac';
        console.log('proxyTemplate', proxyTemplate);
        fs.readFile(proxyTemplate, 'utf8', function(err1, data) {
            var outString = data;
            outString = outString.replace(/MOB_PROXY_HOST/g, newConfig.proxyHostname);
            outString = outString.replace(/MOB_PROXY_PORT/g, newConfig.proxyPort);
            fs.writeFile(proxyOut, outString, 'utf8', function(err2) {
                callback && callback();
            });
        });
    });
}



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
        validate: numberValidation,
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

hostsAndPortsQuestions(function() {
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
});
