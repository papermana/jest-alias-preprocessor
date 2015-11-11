## Usage
Create your own preprocessor file where your declare a configuration file, either by importing it from `webpack.config.js` (or however you named it), or by creating it from scratch. Then import the `jest-alias-preprocessor` and invoke the resulting function passing that configuration file as an only argument. Export the result of that. Finally, link to your preprocessor from your Jest configuration via the `scriptPreprocessor` option.

## Example 1
```
var config = require('./webpack.config.js');

module.exports = require('jest-alias-preprocessor')(config);
```

## Example 2
```
module.exports = require('jest-alias-preprocessor')({
  resolve: {
    root: process.cwd() + '/../',
    alias: {
      _js: './app/js',
      _utils: './app/js/utils',
    },
  },
});
```
