/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'jsonstub-ember',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      API: {
        namespace: 'api'
      }
    },

    'simple-auth': {
      authorizer: 'simple-auth-authorizer:oauth2-bearer',
      crossOriginWhitelist: ['http://jsonstub.dev', 'http://jsonstub.com'],
      routeAfterAuthentication: 'projects'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.API.host = 'http://jsonstub.dev/app_test.php';
  }

  if (environment === 'test') {
    ENV.APP.API.host = 'http://jsonstub.dev/app_test.php';
  }

  if (environment === 'production') {
    ENV.APP.API.host = 'http://jsonstub.com';
  }

  return ENV;
};