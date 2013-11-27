/* global  myIpAddress */
/* available  isInNet, dnsDomainIs, shExpMatch, myIpAddress */

function FindProxyForURL(url, host) {
    'use strict';

    if (host === '127.0.0.1' ||
        host === '0.0.0.0' ||
        host === myIpAddress() ||
        host === '192.168.1.2')
        {
        return 'DIRECT';
    }

    if ( ! url.indexOf('http://' !== 0)) {
        return 'DIRECT';
    }

    return 'PROXY 192.168.1.2:8080';
}

