'use strict';

const permissionSchemaLoader = require('./permissionSchema');
const canMixin = require('./canMixin');
/**
 * @description  This is a [mongoose plugin](http://mongoosejs.com/docs/plugins.html).
 *   It exports a function which modifies a mongoose schema.
 *   It adds 3 paths:
 *     - roles
 *     - permissionsWhitelist
 *     - PermissionsBlacklist
 *
 *   It is meant to be used on a sort of user model.
 * @module plugins/mongoose
 * @requires  canMixin
 */

/**
 * @classDesc Mongoose plugin to provide roles to users
 * @mixin
 */
const mongoosePlugin = module.exports = mongoose => {
  const permissionSchema = permissionSchemaLoader(mongoose);
  return function(schema) {
    /**
     * @lends  plugins/mongoose
     */
    schema.add({
      roles: [String],
      permissionsWhitelist: [permissionSchema],
      permissionsBlacklist: [permissionSchema]
    });

    Object.assign(schema.methods, canMixin);
  };
};
