
(function moblabStart() {
    'use strict';
    /* global io, mobLabHost */
    if (typeof io === 'undefined') {
        return setTimeout(moblabStart, 100);
    }
    var socket = io.connect('http://'+mobLabHost+':3582/', {
        'max reconnection attempts': 5000000,
        'sync disconnect on unload': true,
    });



    var mobLabCommands = {

        reload: function(args, callback) {
            callback(null, 'ok');
            document.location.reload();
        },

        scrollTo: function(args, callback) {
            window.scrollTo(args[0], args[1]);
            callback(null, 'ok');
        },

        go: function(args, callback) {
            var url = args[0];
            var http = 'http://';
            if ((url||'').indexOf(http) !== 0) {
                url = http + url;
            }
            callback(null, 'ok');
            document.location.href = url;
        },

        findElement: function(args, callback) {
            var element = document.querySelector(args[0]);
            if (!element) {
                return callback('element not found');
            }
            if (!element.id) {
                element.id = 'moblab_' + (new Date().getTime()) + ('_') + Math.round(Math.random() * 10000);
            }
            callback(null, '#' + element.id);
        },

        elementVisible: function(args, callback) {
            mobLabCommands.findElement(args, function(err, result) {
                if (err) {
                    return callback(err);
                }
                var isVisible = document.querySelector(result).offsetHeight > 0;
                callback(null, isVisible);
            });
        },



    };

    socket.on('connect', function () {
        console.log('socket connected');
        socket.emit('browser', {
            url: document.location.href,
            commands: Object.keys(mobLabCommands)
        });
    });
    Object.keys(mobLabCommands).forEach(function(command) {
        socket.on(command, mobLabCommands[command]);
    });

    socket.on('disconnect', function() {
        console.log('socket disconnected');
    });

    var tryReconnect = function() {
        if (socket.socket.connected === false &&
            socket.socket.connecting === false) {
            // use a connect() or reconnect() here if you want
            socket.socket.reconnect();
        }
    };
    setInterval(tryReconnect, 2000);

})();
