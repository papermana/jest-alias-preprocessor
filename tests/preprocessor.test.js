'use strict';

jest.autoMockOff();

jest.setMock('../webpack.config.js', {
  resolve: {
    root: '/path/to/dir',
    alias: {
      _js: 'app/js',
      _utils: 'app/js/utils',
    },
  },
});

jest.setMock('babel-jest', {
  process(src, filename) {
    return src;
  },
});

describe('Preprocessor', () => {
  const preprocessor = require('../preprocessor.js');
  const filename = '/path/to/dir/someDir/index.js';

  it('should call transform-jest-deps with a source to transpile', () => {
    jest.mock('transform-jest-deps');

    const src = '';
    const transform = require('transform-jest-deps');
    const altPreprocessor = require('../preprocessor.js');

    altPreprocessor.process(src, filename);

    expect(transform.mock.calls.length > 0).toBe(true);
  });

  it('should return source unchanged if aliases have not been used', () => {
    const src = 'require("file1.js")';

    const result = preprocessor.process(src, filename)

    expect(result).not.toBeUndefined();

    expect(result).toBe(src);
  })

  it('should tolerate files without extensions', () => {
    let src = 'require("_js/main")';

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
  });
});
