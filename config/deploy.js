/* jshint node: true */

function env(name) {
  if (process.env[name]) {
    return process.env[name];
  } else {
    throw new Error('Expected environment variable `' + name + '` to be set but it was not.');
  }
}

module.exports = function(deployTarget) {
  var ENV = {
    build: {}
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV = {
      'build': { environment: 'production' },

      'package': require('../package.json'),

      'revision-data': {
        type: 'git-commit'
      },

      // S3 and S3-index don't play nice with each other,
      // and need separate config objects
      's3': {
        accessKeyId: env('AWS_KEY'),
        bucket: env('AWS_BUCKET'),
        region: env('REGION'),
        secretAccessKey: env('AWS_SECRET'),
        serverSideEncryption: 'AES256',
        signatureVersion: 'v4'
      },

      's3-index': {
        accessKeyId: env('AWS_KEY'),
        allowOverwrite: true,
        bucket: env('AWS_BUCKET'),
        region: env('REGION'),
        secretAccessKey: env('AWS_SECRET'),
        serverSideEncryption: 'AES256',
        signatureVersion: 'v4'
      }
    };
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
