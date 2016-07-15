'use strict';

jest.autoMockOff();

const config = {
  resolve: {
    root: '/path/to/dir',
    alias: {
      _js: 'app/js',
      _utils: 'app/js/utils',
      _helper: 'app/js/helper.js',
    },
  },
};

const preprocessor = require('../index.js')(config);

describe('Module index.js', () => {
  it('should return an object with a process() property', () => {
    const callResult = preprocessor;

    expect(callResult).toBeDefined();

    expect(callResult.process).toBeDefined();
  });
});

describe('The process() method', () => {
  const filename = '/path/to/dir/someDir/index.js';

  it('should call transform-jest-deps with a source to transpile', () => {
    jest.mock('transform-jest-deps');

    const src = '';
    const transform = require('transform-jest-deps');
    const altPreprocessor = require('../index.js')(config);

    altPreprocessor.process(src, filename);

    expect(transform.mock.calls.length > 0).toBe(true);
  });

  it('should return source unchanged if aliases have not been used', () => {
    const src = 'require("file1.js")';
    const src2 = '';

    const callResult = preprocessor.process(src, filename);
    const callResult2 = preprocessor.process(src2, filename);

    expect(callResult).toBe(src);
    expect(callResult2).toBe(src2);
  });

  it('should tolerate files without extensions', () => {
    const src = 'require("_js/main")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js/main")');
  });

  it('should convert aliases into absolute paths', () => {
    let src = 'require("_js/file1.js")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js/file1.js")');

    src = 'require("_js/dir/file1.js")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js/dir/file1.js")');

    src = 'require("_js/dir/another/file1.js"); require("_utils/file2.js")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js/dir/another/file1.js"); require("/path/to/dir/app/js/utils/file2.js")');

    src = 'require("_js")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js")');

    src = 'require("_js/")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js/")');

    src = 'require("_helper")';

    expect(preprocessor.process(src, filename))
    .toBe('require("/path/to/dir/app/js/helper.js")');
  });
});
