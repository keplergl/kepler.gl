require('@babel/register')({
  extensions: ['.tsx', '.ts', '.js', '.json']
});
require('@babel/polyfill');
var path = require('path');
var glob = require('glob');

// eslint-disable-next-line func-names
process.argv.slice(2).forEach(function(arg) {
  // eslint-disable-next-line func-names
  glob(arg, function(er, files) {
    if (er) throw er;

    // eslint-disable-next-line func-names
    files.forEach(function(file) {
      require(path.resolve(process.cwd(), file));
    });
  });
});
