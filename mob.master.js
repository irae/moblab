'use strict';

var config = require('./lib/config').load();
var master = require('socket.io-client').connect('http://'+config.driverHostname+':'+config.driverPort+'/', {
    'connect timeout': 2000,
    'sync disconnect on unload': true,
});

master.on('disconnect', function() {
    console.log('master disconnected');
    process.exit();
});
master.on('connect', function() {
    console.log('master conected');
    var repl = require("repl");
    var cli = repl.start({
        prompt: "moblab > ",
        input: process.stdin,
        output: process.stdout,
        eval: function cliCommand(cmd, context, filename, callback) {
            cmd = cmd.substr(1,cmd.length - 3);
            if(!cmd) {
                console.log('no cmd', cmd);
                return callback();
            }
            cmd = cmd.split(' ');
            var command = ['browser_broadcast', cmd.splice(0,1)[0], cmd];
            command.push(function(data) {
                callback.apply(context, arguments);
            });
            master.emit.apply(master, command);
        }
    });
    cli.on('exit', function () {
        console.log('master disconnected');
        process.exit();
    });
});
