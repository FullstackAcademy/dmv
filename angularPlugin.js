'use strict';

/**
 * @description An angular module that hooks into $stateChangeStart event on UI-Router and lets routes define permissions
 * @example
 * .factory('yourLoginFactory', function(authConfig) {
 *   // on login
 *   authConfig.setUser(yourUser) // <- YOUR USER MUST HAVE CAN METHOD
 * })
 * @module plugins/angular
 */

const dmv = require('./dmv');
const roleManager = require('./roleManager');
const canMixin = require('./canMixin');

module.exports = angular => {
  angular.module('dmv', [])
    .factory('canPlugin', function() {
      return function(proto) {
        angular.extend(proto, canMixin);
      };
    })
    .factory('authConfig', ['$rootScope', '$injector', function($rootScope, $injector) {
      let userGetterMethod = function() {};
      let asyncUserGetterMethod = function() {};
      let canGetUserAsync = false;

      const getUser = function() {
        return $injector.invoke(userGetterMethod);
      };
      const getUserAsync = function() {
        return $injector.invoke(asyncUserGetterMethod);
      };

      return {
        getUserAsync: function(fn) {
          asyncUserGetterMethod = fn;
          canGetUserAsync = true;
        },
        getUser: function(fn) {
          userGetterMethod = fn;

          $rootScope.can = (verb, noun) => {
            try {
              return getUser().can(verb, noun);
            } catch (e) {
              return false;
            }
          }
          $rootScope.hasRole = role => {
            try {
            return getUser().hasRole(role);
            } catch (e) {
              return false;
            }
          }


          $rootScope.$on('$stateChangeStart', function(event, next) {
            let user = getUser();
            if (canGetUserAsync) {
              user = getUserAsync();
            }
            next.resolve.dmvAuthPromise = () => Promise.resolve(user)
              .then(user => {
                const forbidden = new Error(`You're not authorized to view his page.`);
                if(next && next.auth) {
                  if(!user) {
                    $rootScope.$broadcast('NOT_AUTHENTICATED');
                    throw forbidden;
                  }
                  if(next.auth === true) { return; }
                  if(typeof next.auth === 'function') {
                    if(!next.auth.call(event, user, next)) {
                      $rootScope.$broadcast('NOT_AUTHORIZED');
                      throw forbidden;
                    }
                    return;
                  }
                  for(let verb in next.auth) {
                    if(next.auth.hasOwnProperty(verb)) {
                      let noun = next.auth[verb];
                      if(!user.can(verb, noun)) {
                        $rootScope.$broadcast('NOT_AUTHORIZED');
                        throw forbidden;
                      }
                    }
                  }
                }

              });
          });
        }
      };

    }]);
}

