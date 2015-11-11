## Usage
Create your own preprocessor file and link to it from Jest's configuration via the `scriptPreprocessor` option. Inside of your preprocessor file, require `jest-alias-preprocessor` and invoke the resulting function, optionally passing a configuration object.

## Example
```
module.exports = require(jest-alias-preprocessor)({
  rootLocation: process.cwd(),
  configLocation: '../webpack/config.js',
});
```
