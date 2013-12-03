'use strict';

var driver_hostname = process.env.MOBLAB_DRIVER_HOST ? process.env.MOBLAB_DRIVER_HOST : 'localhost';
var driver_port = process.env.MOBLAB_DRIVER_PORT ? process.env.MOBLAB_DRIVER_PORT : 3581;

var master = require('socket.io-client').connect('http://'+driver_hostname+':'+driver_port+'/', {
    'connect timeout': 2000,
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