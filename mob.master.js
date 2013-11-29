'use strict';

var master = require('socket.io-client').connect('http://localhost:3582/master', {
    // 'connect timeout': 2000,
    // 'max reconnection attempts': 50,
    // 'force new connection': true,
    'sync disconnect on unload': true,
});

master.on('connect', function(connection) {
    console.log('master conected to server');
    master.on('event', function() {
        console.log('event', arguments);
    });
    master.on('disconnect', function() {
        console.log('disconnect', arguments);
    });
});

// commands to the browsers
function reload() {
    master.emit('reload');
}
function scrollTo(x, y) {
    master.emit('scrollTo', { x:x , y:y });
}
function go(url) {
    var http = 'http://';
    if ((url||'').indexOf(http) !== 0) {
        url = http + url;
    }
    master.emit('go', url);
}

if (module.parent) {
    module.exports = {
        socket: master,
        go: go,
        reload: reload,
        scrollTo: scrollTo,
    };
} else {
    // repl interface
    var repl = require("repl");
    var cli = repl.start({
        prompt: "moblab > ",
        input: process.stdin,
        output: process.stdout,
    });
    cli.on('exit', function () {
        process.exit();
    });

    // expose commands to repl
    cli.context.go = go;
    cli.context.reload = reload;
    cli.context.scrollTo = scrollTo;
}

