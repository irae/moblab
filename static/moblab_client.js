
(function moblabStart() {
    'use strict';
    /* global io, mobLabHost */
    if (typeof io === 'undefined') {
        return setTimeout(moblabStart, 100);
    }
    var socket = io.connect('http://'+mobLabHost+':3582/', {
        'connect timeout': 2000,
        'max reconnection attempts': 5000000,
        // 'force new connection': true,
        'sync disconnect on unload': true,
    });
    socket.on('connect', function () {
        console.log('socket connected');
        socket.emit('browser', { url: document.location.href });
    });
    socket.on('disconnect', function() {
        console.log('socket disconnected');
    });

    socket.on('reload', function(args, callback) {
        callback('ok');
        document.location.reload();
    });
    socket.on('scrollTo', function(args, callback) {
        window.scrollTo(args[0], args[1]);
        callback('ok');
    });
    socket.on('go', function(args, callback) {
        var url = args[0];
        if (typeof url !== 'string' || !callback) {
            return callback('error');
        }
        var http = 'http://';
        if ((url||'').indexOf(http) !== 0) {
            url = http + url;
        }
        callback('ok');
        document.location.href = url;
    });
    socket.on('findElement', function findElement(args, found) {
        var element = document.querySelector(args[0]);
        found && found(!!element);
    });

})();
