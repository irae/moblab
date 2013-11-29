/* global  myIpAddress */
/* available  isInNet, dnsDomainIs, shExpMatch, myIpAddress */

function debug(message) {
    // alert(message);
}

function FindProxyForURL(url, host) {
    'use strict';

    if (host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        host === myIpAddress() ||
        host === '192.168.1.2')
        {
        debug('DIRECT1 ' + url);
        return 'DIRECT';
    }

    if (!url || url.indexOf('http://') !== 0) {
        debug('DIRECT2 ' + url);
        return 'DIRECT';
    }

    debug('PROXY ' + url);
    return 'PROXY 192.168.1.2:8581';
}

