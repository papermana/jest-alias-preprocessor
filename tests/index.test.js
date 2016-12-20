'use strict';

jest.autoMockOff();

const config = {
  resolve: {
    root: './__fixtures__/',
    alias: {
      _js: 'app/js',
      _utils: 'app/js/utils',
      _helper: 'app/js/utils/helper.js',
    },
  },
};

const preprocessorHoc = require('../index.js');
const preprocessor = preprocessorHoc(config);

describe('Module index.js', () => {
  it('should return an object with a process() property', () => {
    const callResult = preprocessor;

    expect(callResult).toBeDefined();

    expect(callResult.process).toBeDefined();
  });
});

describe('The process() method', () => {
  const filename = '__fixtures__/someDir/index.js';

  it('should call transform-jest-deps with a source to transpile', () => {
    jest.mock('transform-jest-deps');

    const src = '';
    const transform = require('transform-jest-deps');
    const altPreprocessor = require('../index.js')(config);

    altPreprocessor.process(src, filename);

    expect(transform.mock.calls.length > 0).toEqual(true);
  });

  it('should return source unchanged if aliases have not been used', () => {
    const src = 'require("file1.js")';
    const src2 = '';

    const callResult = preprocessor.process(src, filename);
    const callResult2 = preprocessor.process(src2, filename);

    expect(callResult).toEqual(src);
    expect(callResult2).toEqual(src2);
  });

  it('should tolerate files without extensions', () => {
    const src = 'require("_utils/helper")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js/utils/helper")');
  });

  it('should convert aliases into absolute paths', () => {
    let src = 'require("_js/index.js")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js/index.js")');

    src = 'require("_js/utils/helper.js")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js/utils/helper.js")');

    src = 'require("_js/index.js"); require("_utils/helper.js")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js/index.js");' +
      ' require("__fixtures__/app/js/utils/helper.js")');

    src = 'require("_js")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js")');

    src = 'require("_js/")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js/")');

    src = 'require("_helper")';

    expect(preprocessor.process(src, filename))
    .toEqual('require("__fixtures__/app/js/utils/helper.js")');
  });
});

describe('webpack 2', () => {
  const filename = '__fixtures__/someDir/index.js';

  it('should work with webpack2 config', () => {
    const webpack2Config = {
      resolve: {
        modules: [
          'node_modules',
          '__fixtures__/app',
          '__fixtures__/',
        ],
        alias: {
          _js: 'app/js',
          _utils: 'app/js/utils',
          _helper: 'js/utils/helper.js',
        },
      },
    };
    const preprocessorWP2 = preprocessorHoc(webpack2Config);

    let src = 'require("_js/index.js")';

    expect(preprocessorWP2.process(src, filename))
      .toEqual('require("__fixtures__/app/js/index.js")');

    src = 'require("_js/utils/helper.js")';

    expect(preprocessorWP2.process(src, filename))
      .toEqual('require("__fixtures__/app/js/utils/helper.js")');

    src = 'require("_js/index.js"); require("_utils/helper.js")';

    expect(preprocessorWP2.process(src, filename))
      .toEqual('require("__fixtures__/app/js/index.js");' +
        ' require("__fixtures__/app/js/utils/helper.js")');

    src = 'require("_js")';

    expect(preprocessorWP2.process(src, filename))
      .toEqual('require("__fixtures__/app/js")');

    src = 'require("_js/")';

    expect(preprocessorWP2.process(src, filename))
      .toEqual('require("__fixtures__/app/js/")');

    src = 'require("_helper")';

    expect(preprocessorWP2.process(src, filename))
      .toEqual('require("__fixtures__/app/js/utils/helper.js")');
  });
});
