'use strict';

function load(preventExit) {
    var config;
    try {
        config = require(__dirname + '/../config.json');
    } catch(e) {}
    // config.servos = config.servos || [];
    if (!config) {
        if (preventExit) {
            return {};
        }
        console.log('No config found. Run `node mob.configure.js` to generate one');
        process.exit(1);
    }
    return config;
}

function addServos(servos, config) {
    config.servos = [];
    servos.forEach(function(servo) {
        config.servos.push({
            pin: servo.pin,
            landscape: servo.landscape,
            portrait: servo.portrait
        });
    });
}

function save(config) {
    var fs = require('fs');
    fs.writeFile(__dirname + "/../config.json", JSON.stringify(config, null, '  '), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Moblab config saved!\n");
        }
    });
}

module.exports = {
    load: load,
    save: save,
    addServos: addServos,
};

