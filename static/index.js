"use strict";
var app = require('./server');
var port = process.env.PORT ? process.env.PORT : 3581;
var hostname = require('os').hostname();

if (module.parent) {
    module.exports = app;
} else {
    app.listen(port, function () {
        console.log('%s listening at %s port %s', app.name || 'server', hostname, port);
    });
}
