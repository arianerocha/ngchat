const path = require('path');

module.exports = function (application) {
  const srcModule = path.join(application, 'js');

  return [
    {
      test: /\.js$/,
      loader: 'babel-loader',
    },

  ];
};
