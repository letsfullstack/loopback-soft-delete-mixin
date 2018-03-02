SoftDelete Loopback Mixin
=============

This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework. It allows entities of any Model to be "soft deleted" by adding `deletedAt` and `_isDeleted` attributes. Queries following the standard format will no return these entities; they can only be accessed by adding `{ deleted: true }` to the query object (at the same level as `where`, `include` etc).
 
This mixin was recoded since the current available softdelete mixin is not working in Node.js v4.x.x, probably caused by ES6. This code is forked from https://github.com/gausie/loopback-softdelete-mixin

To implement copy this file to mixins folder or clone this private repository (requires adding the package folder path to mixins inside model-config json file), and add "SoftDelete": true in mixins on YourModel.json file.

To delete a row or data, don't use destroyAll etc., use YourModel.delete

To find data that is considered deleted, add includeDeleted: true in where filter

Author: Saggaf Arsyad

Modularization: Let's Comunica

E-mail: saggaf@area54labs.net

**LAST VERSION: 0.0.2**

Install
-------

```bash
  npm install --save git+ssh://git@bitbucket.org/letscomunicadev/loopback-lets-soft-delete-mixin.git#v0.0.2
```

Updates
-------

Made a modification? Test it at least in one project before submiting a version. It still needs unit testing and CI with projects. After everything seems perfectly up-to-date, run the following steps:

1\. Commit and push your updates using Let's Bitbucket credentials

2\. Change and commit a new tag version (always check and update the last version here and in package.json):

```bash
$ git tag -a vX.X.X -m "version_message"
```

3\. Push the new tag version to remote repository:

```bash
$ git push origin vX.X.X  # Version needs to be the same from commit
```

4\. Run npm installation with the newest version:

```bash
  npm install --save git+ssh://git@bitbucket.org/letscomunicadev/loopback-lets-soft-delete-mixin.git#vX.X.X
```

Configure
----------

To use with your Models add the `mixins` attribute to the definition object of your model config.

```json
  {
    "name": "Widget",
    "properties": {
      "name": {
        "type": "string",
      },
    },
    "mixins": {
      "SoftDelete" : true,
    },
  },
```

There are a number of configurable options to the mixin. You can specify alternative property names for `deletedAt` and `_isDeleted`, as well as configuring deletion to "scrub" the entity. If true, this sets all but the "id" fields to null. If an array, it will only scrub properties with those names.

```json
  "mixins": {
    "SoftDelete": {
      "deletedAt": "deletedOn",
      "_isDeleted": "isDeleted",
      "scrub": true,
    },
  },
```

Retrieving deleted entities
---------------------------

To run queries that include deleted items in the response, add `{ deleted: true }` to the query object (at the same level as `where`, `include` etc).
