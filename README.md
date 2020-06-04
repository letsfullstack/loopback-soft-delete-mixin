![Publish Github Package](https://github.com/letsfullstack/loopback-soft-delete-mixin/workflows/Publish%20Github%20Package/badge.svg)

# Loopback SoftDelete Mixin

This module is designed for the [Strongloop Loopback](https://github.com/strongloop/loopback) framework. It allows entities of any Model to be "soft deleted" by adding `deletedAt` and `_isDeleted` attributes. Queries following the standard format will no return these entities; they can only be accessed by adding `{ deleted: true }` to the query object (at the same level as `where`, `include` etc).

To implement copy this file to mixins folder or clone this private repository (requires adding the package folder path to mixins inside model-config json file), and add "SoftDelete": true in mixins on YourModel.json file.

To delete a row or data, don't use destroyAll etc., use YourModel.delete

To find data that is considered deleted, add includeDeleted: true in where filter

Original author: Saggaf Arsyad

Node version used for development: **v10.13.0**

## Contributing

:boom: In case you are making a commit for this package repository, **MAKE SURE TO READ AND UNDERSTAND THE FOLLOWING TOPICS**:

1\. Every commit that runs on the [master branch](https://github.com/letsfullstack/loopback-soft-delete-mixin/tree/master) runs through the Publish Github Package Workflow on Github Actions. So **be sure to check if your code is well written and tested**, since it'll be published if the code passes the Continuous Integration (CI) unit tests.

2\. If the commit passes through the Github Actions workflow, the module will be released as a package in the Github Packages Registry. This workflow has an [underlying command](https://github.com/phips28/gh-action-bump-version) that **increments/bumps the version from the latest release based on commit messages**, such as:

- If the string "BREAKING CHANGE" or "major" is found anywhere in any of the commit messages or descriptions, the **major version** will be incremented (i.e. 1.X.X).

- If a commit message begins with the string "feat" or includes "minor" then the **minor version** will be increased (i.e. X.1.X). This works for most common commit metadata for feature additions: "feat: new API" and "feature: new API".

- All other changes will increment the **patch version** (i.e. X.X.1).

3\. Furthermore, the workflow has also an underlying command that deploys automatically a new release when a success test/deployment takes places. These releases can be found [here](https://github.com/letsfullstack/loopback-soft-delete-mixin/releases).

## Installation

In your application root directory, enter this command to install the connector:

```shell
$ npm install @letsfullstack/loopback-soft-delete-mixin
```

## Configure

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

## Retrieving deleted entities

To run queries that include deleted items in the response, add `{ deleted: true }` to the query object (at the same level as `where`, `include` etc).

## Testing


