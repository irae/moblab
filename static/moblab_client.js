'use strict';

function newConnection() {
    /* global SockJS, mobLabHost */
    var sock = new SockJS('http://'+mobLabHost+':3582/moblab');
    sock.onopen = function() {
        console.log('moblab open');
        sock.send('moblab client connected from: ' + document.location.href);
    };
    sock.onmessage = function(e) {
        console.log('moblab message', e.data);
        if(e.data.indexOf('load:') === 0) {
            var newLoc = e.data.substr('load:'.length);
            if (newLoc.indexOf('http://')!==0) {
                newLoc = 'http://' + newLoc;
            }
            document.location.href = newLoc;
        }
        if(e.data.indexOf('reload:') === 0) {
            document.location.reload();
        }
    };
    sock.onclose = function() {
        console.log('moblab close');
        setTimeout(newConnection, 1000);
    };
}
// start late to avoid infinite loading
newConnection();

