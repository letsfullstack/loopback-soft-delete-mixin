# loopback-fw-soft-delete-mixin

This module is designed for the Strongloop Loopback framework. It allows entities of any Model to be &#34;soft deleted&#34; by adding deletedAt and _isDeleted attributes.

Own modified mixin due to current available soft-delete mixin is not working in Node.js v4.x.x, probably caused by ES6. This code is forked from https://github.com/gausie/loopback-softdelete-mixin.