'use strict';

// setup static server and socket.io for browsers
var hostname = process.env.MOBLAB_DRIVER_HOST ? process.env.MOBLAB_DRIVER_HOST : 'localhost';
var driver_port = process.env.MOBLAB_DRIVER_PORT ? process.env.MOBLAB_DRIVER_PORT : 3581;
var static_server = require('./lib/static_index');
var io = require('socket.io').listen(static_server);
var async = require('async');
io.set('heartbeat interval', 2);
io.set('heartbeat timeout', 2.1);
io.set('log level', 1);

io.on('connection', function(socket) {
    socket.on('browser', function(info) {
        socket.join('browsers');
        // console.log(socket.handshake);
        socket.set('commands', info.commands);
        socket.on('disconnect', function() {
            // console.log('browser disconnect');
            socket.leave('browsers');
        });
    });
    socket.on('browser_broadcast', function(command, args, doneAll) {
        async.map(io.sockets.clients('browsers'), function (browser, doneOne) {
            browser.get('commands', function(err, commands) {
                if (commands.indexOf(command) === -1) {
                    doneOne(null, 'unknow command');
                } else {
                    var maxTime = setTimeout(function() {
                        doneOne(null, 'timeout');
                        browser.disconnect();
                    },2 * 1000);
                    browser.emit(command, args, function(error, result) {
                        clearTimeout(maxTime);
                        doneOne(error, result);
                    });
                }
            });
        }, doneAll);
    });
});

static_server.listen(driver_port, '0.0.0.0');
console.log('MobLab Driver listening on '+hostname+':'+driver_port);
