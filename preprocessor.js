/**
 * @module preprocessor
 * @tutorial
 */

'use strict';

const path = require('path');
const babelJest = require('babel-jest');
const transform = require('transform-jest-deps');

function preprocessorFactory(options) {
  const configLocation = options.configLocation || './webpack.config.js';
  const webpackConfig = require(configLocation);
  const aliases = Object.keys(webpackConfig.resolve.alias)
  .map(key => {
    const value = path.join(webpackConfig.resolve.root, webpackConfig.resolve.alias[key]);

    return {
      key,
      value,
    };
  });

  /**
   * A callback function for transform-jest-deps.
   * @param {string} require - Content of a require() statement. Automatically passed by transform-jest-deps.
   * @returns {string} Value passed in, either modifed by the function, or not.
   */

  function resolve(require) {
    for (let i = 0; i < aliases.length; i++) {
      const alias = aliases[i];
      const regex = new RegExp('^' + alias.key);

      if (regex.test(require)) {
        return require.replace(regex, alias.value);
      }
    }

    return require;
  }

  return {
    process(src, path) {
      src = babelJest.process(src, path);
      src = transform(src, resolve);

      return src;
    },
  };
}

module.exports = preprocessorFactory;
