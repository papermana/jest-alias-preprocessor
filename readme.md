## Usage
Create your own preprocessor file and link to it from Jest's configuration via the `scriptPreprocessor` option. Inside of your preprocessor file require jest-alias-preprocessor and invoke the resulting function with an options object which currently can only have a `configLocation` property with a value which is a string and points to your `webpack.config.js` (or however you named it) file.

## Example
```
module.exports = require(jest-alias-preprocessor)({
  configLocation: './webpack.config.js',
});
```
