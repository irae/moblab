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

function save(config, callback) {
    var fs = require('fs');
    fs.writeFile(__dirname + "/../config.json", JSON.stringify(config, null, '  '), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Moblab config saved!\n");
        }
        callback && callback();
    });
}

module.exports = {
    load: load,
    save: save,
};

