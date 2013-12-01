/* available  isInNet, dnsDomainIs, shExpMatch, myIpAddress */

function FindProxyForURL(url, host) {
    'use strict';
    if (!url || url.indexOf('http://') !== 0) {
        return 'DIRECT';
    }

    return 'PROXY 192.168.1.2:8581';
}

