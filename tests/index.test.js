jest.autoMockOff();

const preprocessorHoc = require('../index.js');
const webpackConfig = {
  resolve: {
    root: './__fixtures__/',
    alias: {
      _js: 'app/js',
      _utils: 'app/js/utils',
      _helper: 'app/js/utils/helper.js',
    },
  },
};
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

describe('Module index.js', () => {
  it('should return an object with a process() property', () => {
    const callResult = preprocessorHoc(webpackConfig);

    expect(callResult).toBeDefined();
    expect(callResult.process).toBeDefined();
  });
});

describe('The process() method', testProcessMethod(webpackConfig));
describe('webpack 2', testProcessMethod(webpack2Config));

function testProcessMethod(config) {
  const filename = '__fixtures__/someDir/index.js';
  const preprocessor = preprocessorHoc(config);

  return () => {
    it('should call transform-jest-deps with a source to transpile', () => {
      jest.mock('transform-jest-deps');

      const src = '';
      const transform = require('transform-jest-deps');
      const altPreprocessor = require('../index.js')(config);

      altPreprocessor.process(src, filename);
      expect(transform.mock.calls.length).toBeGreaterThan(0);

      jest.unmock('transform-jest-deps');
    });

    it('should return source unchanged if aliases have not been used', () => {
      const src = 'require("file1.js")';
      const src2 = '';
      const callResult = preprocessor.process(src, filename);
      const callResult2 = preprocessor.process(src2, filename);

      expect(callResult).toEqual(src);
      expect(callResult2).toEqual(src2);
    });

    it('should convert aliases into real paths', () => {
      let src;

      src = 'require("_js/index.js")';
      expect(preprocessor.process(src, filename))
        .toEqual('require("__fixtures__/app/js/index.js")');

      src = 'require("_js/utils/helper.js")';
      expect(preprocessor.process(src, filename))
        .toEqual('require("__fixtures__/app/js/utils/helper.js")');

      src = 'require("_js/index.js"); require("_utils/helper.js")';
      expect(preprocessor.process(src, filename))
        .toEqual(
          'require("__fixtures__/app/js/index.js");' +
          ' require("__fixtures__/app/js/utils/helper.js")'
        );
    });

    it('should handle files without extensions', () => {
      const src = 'require("_utils/helper")';

      expect(preprocessor.process(src, filename))
        .toEqual('require("__fixtures__/app/js/utils/helper")');
    });

    it('should handle directories as well as regular files', () => {
      let src;

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

    it('should ignore alias strings used as, or inside of, a filename or directory', () => {
      let src;

      src = 'require("__fixtures__/_js")';
      expect(preprocessor.process(src, filename))
        .toEqual('require("__fixtures__/_js")');

      src = 'require("__fixtures__/test_js")';
      expect(preprocessor.process(src, filename))
        .toEqual('require("__fixtures__/test_js")');
    });
  };
}
