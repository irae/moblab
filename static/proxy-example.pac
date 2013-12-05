/* available  isInNet, dnsDomainIs, shExpMatch, myIpAddress */

function FindProxyForURL(url, host) {
    'use strict';
    if (!url || url.indexOf('http://') !== 0) {
        return 'DIRECT';
    }

    return 'PROXY MOB_PROXY_HOST:MOB_PROXY_PORT';
}

