
(function moblabStart() {
    'use strict';
    /* global io, mobLabHost */
    if (typeof io === 'undefined') {
        return setTimeout(moblabStart, 100);
    }
    var socket = io.connect('http://'+mobLabHost+':3582/client', {
        // 'connect timeout': 2000,
        // 'max reconnection attempts': 50,
        // 'force new connection': true,
        'sync disconnect on unload': true,
    });
    socket.on('connect', function () {
        console.log('socket connected');
        socket.emit('newclient', { url: document.location.href });
    });
    socket.on('disconnect', function() {
        console.log('socket disconnected');
    });
    socket.on('reload', function() {
        document.location.reload();
    });
    socket.on('scrollTo', function(to) {
        window.scrollTo(to.x, to.y);
    });
    socket.on('go', function(url) {
        document.location.href = url;
    });
})();
