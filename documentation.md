# preprocessor

# preprocessorFactory

Creates a new preprocessor, based on options given by the user.

**Parameters**

-   `options` **[Object]** The options object.
    -   `options.rootLocation` **[string]** Root location of your project. You can use process.cwd() to return absolute path to your preprocessor file. By default it's the location of jest-alias-preprocessor. (optional, default `process.cwd()`)
    -   `options.configLocation` **[string]** Location of the webpack config file relative to the preprocessor. (optional, default `'./webpack.config.js'`)

Returns **Object** An object containing a `process` property, used as a preprocessor.
