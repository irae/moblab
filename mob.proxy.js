'use strict';

var config = require('./lib/config').load();
var proxy = require('http-mitm-proxy')();

proxy.onError(function(ctx, err) {
    console.error('proxy error:', err);
});

proxy.onRequest(function(ctx, callback) {
    // console.log('REQUEST: http://' + ctx.clientToProxyRequest.headers.host + ctx.clientToProxyRequest.url);

    delete ctx.clientToProxyRequest.headers['accept-encoding'];
    delete ctx.clientToProxyRequest.headers['proxy-connection']; // causes certain sites to hang
    delete ctx.clientToProxyRequest.headers['proxy-authorization'];

    return callback();
});

// proxy.onRequestData(function(ctx, chunk, callback) {
//     //console.log('request data length: ' + chunk.length);
//     return callback(null, chunk);
// });

function mobLabInject(ctx, chunk, callback) {
    var html;
    var inject = ''+
        '<script>'+
        'if(self==top) {'+
        
        '    window.mobLabHost = "'+config.driverHostname+':'+config.driverPort+'";'+

        '    var script = document.createElement("script");'+
        '    script.type = "text/javascript";'+
        '    script.src = "http://'+config.driverHostname+':'+config.driverPort+'/socket.io/socket.io.js";'+
        '    document.head.appendChild(script);'+

        '    var script = document.createElement("script");'+
        '    script.type = "text/javascript";'+
        '    script.src = "http://'+config.driverHostname+':'+config.driverPort+'/moblab_client.js";'+
        '    document.head.appendChild(script);'+
        '}'+
        '</script>';
    try {
        html = chunk.toString();
    } catch(e) {}
    if (html && /<\/head>/i.test(html)) {
        html = html.replace(/<\/head>/i, inject + '</head>');
        chunk = new Buffer(html);
    }
    return callback(null, chunk);
}

proxy.onResponse(function(ctx, callback) {
    // console.log('RESPONSE: http://' + ctx.clientToProxyRequest.headers.host + ctx.clientToProxyRequest.url);

    var type = ctx.serverToProxyResponse.headers['content-type'];
    if (type && type.indexOf('html')>-1) {
        ctx.onResponseData(mobLabInject);
    }

    return callback(null);
});

// proxy.onResponseData(function(ctx, chunk, callback) {
//     //console.log('response data length: ' + chunk.length);
//     return callback(null, chunk);
// });

// helps to ensure the proxy stays up and running
process.on('uncaughtException',function(err){
    console.error('uncaught exception: '+err.message);
    console.error(err.stack);
});

proxy.listen({
    port: config.proxyPort
});
console.log('MobLab Proxy listening on ' + config.proxyPort);

