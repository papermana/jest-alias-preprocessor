# jest-alias-preprocessor
This package allows you to use aliases when testing with [Jest](https://github.com/facebook/jest). It's very handy when you want to use your existing [webpack](https://github.com/webpack/webpack) configuration, but you can also use it on its own.

Really, it's just a very simple wrapper on top of [transform-jest-deps](https://github.com/Ticketmaster/transform-jest-deps).

## Usage
`jest-alias-preprocessor` exports a higher-order function; to make it work, you have to provide a configuration object for it to use. Simply create a new file, import this module, and either import `webpack.config.js`, or create a new object from scratch. Then, invoke the function, passing the config as an argument. Finally, link to the preprocessor from your Jest configuration using the `scriptPreprocessor` option.

Note that your config has to look like a webpack config object even if you don't use webpack. It needs a `resolve` property, and that property needs to have a `root` and `alias` property. You can see how it looks below.

### Example 1 ― everything in root directory
```
const config = require('./webpack.config.js');

module.exports = require('jest-alias-preprocessor')(config);
```

### Example 2 ― no Webpack config
```
module.exports = require('jest-alias-preprocessor')({
  resolve: {
    root: process.cwd(),
    alias: {
      _js: './app/js',
      _utils: './app/js/utils',
    },
  },
});
```

### Example 3 ― with babel-jest
```
var config = require('./webpack.config.js');
var aliasPreprocessor = require('jest-alias-preprocessor')(config);
var babel = require('babel-jest');

module.exports = {
  process: function(src, path) {
    src = aliasPreprocessor.process(src, path);
    src = babel.process(src, path);

    return src;
  },
};
```
