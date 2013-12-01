'use strict';

var master = require('socket.io-client').connect('http://localhost:3582/', {
    // 'connect timeout': 2000,
    // 'max reconnection attempts': 50,
    // 'force new connection': true,
    'sync disconnect on unload': true,
});

master.on('disconnect', function() {
    console.log('master disconnected');
    process.exit();
});
master.on('connect', function(connection) {
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