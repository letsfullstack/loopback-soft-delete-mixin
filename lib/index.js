'use strict'

var deprecate = require('depd')('loopback-lets-soft-delete-mixin');
var softDelete = require('./soft-delete');

module.exports = function mixin(app) {
    app.loopback.modelBuilder.mixins.define = deprecate.function(app.loopback.modelBuilder.mixins.define,
        'app.modelBuilder.mixins.define: Use mixinSources instead ' +
        'see https://bitbucket.org/letscomunicadev/loopback-lets-soft-delete-mixin#mixinsources')
    app.loopback.modelBuilder.mixins.define('SoftDelete', softDelete)
};