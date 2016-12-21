'use strict';

const fs = require('fs');
const path = require('path');
const flatten = require('lodash.flatten');
const transform = require('transform-jest-deps');

/**
 * Creates a new preprocessor, based on options given by the user.
 * @param {Object} config - Configuration object containing resolve rules. Can be an imported `webpack.config.js`.
 * @param {Object} config.resolve - A required property of config.
 * @param {string} config.resolve.root - The objective path to the root directory of your project. You can use `process.cwd()` to get the current working directory.
 * @param {Object} config.resolve.alias - An object containing alias rules as string properties, where the key is an alias to be substituted, and the value is a path to the aliased file or directory. Each path has to be relative to the `config.resolve.root` property.
 * @returns {Object} - An object containing a `process` property, used as a preprocessor.
 */
function preprocessorFactory(config) {
  const roots = config.resolve.root ? [config.resolve.root] : config.resolve.modules;
  const aliases = flatten(
    roots.map(root => Object.keys(config.resolve.alias)
      .map(key => {
        const value = path.join(root, config.resolve.alias[key]);

        try {
          fs.statSync(value);
          return {
            key,
            value,
          };
        }
        catch (e) {
          return undefined;
        }
      })
      .filter(Boolean)
    )
  );

  /**
   * A callback function for transform-jest-deps.
   * @private
   * @param {string} require - Content of a `require()` statement. Automatically passed by `transform-jest-deps`.
   * @returns {string} - Value passed in, either modifed by the function, or not.
   */
  function resolve(require) {
    for (let i = 0; i < aliases.length; i++) {
      const alias = aliases[i];
      const regex = new RegExp('^' + alias.key);

      if (regex.test(require)) {
        return path.normalize(require.replace(regex, alias.value));
      }
    }

    return require;
  }

  return {
    process(src) {
      return transform(src, resolve);
    },
  };
}

module.exports = preprocessorFactory;
