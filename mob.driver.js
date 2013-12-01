'use strict';

// setup static server and socket.io for browsers
var static_server = require('./lib/static_index');
var io = require('socket.io').listen(static_server);
var async = require('async');
io.set('heartbeat interval', 2 * 1000);
io.set('heartbeat timeout', 2.1 * 1000);
io.set('close timeout', 2.2 * 1000);
io.set('log level', 1);

io.on('connection', function(socket) {
    socket.on('browser', function(info) {
        socket.join('browsers');
        console.log('browser', info);
        socket.on('disconnect', function() {
            console.log('browser disconnect');
            socket.leave('browsers');
        });
    });
    socket.on('browser_broadcast', function(command, args, doneAll) {
        async.map(io.sockets.clients('browsers'), function (browser, doneOne) {
            var maxTime = setTimeout(function() {
                doneOne(null, 'error');
                browser.disconnect();
            },2 * 1000);
            browser.emit(command, args, function(data) {
                clearTimeout(maxTime);
                var results = [null].concat(Array.prototype.slice.call(arguments));
                doneOne.apply(browser, results);
            });
        }, doneAll);
    });
});

static_server.listen(3582, '0.0.0.0');
console.log('MobLab Driver listening on 0.0.0.0:3582');
