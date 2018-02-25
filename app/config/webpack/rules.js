const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (application) {
  const srcModule = path.join(application, 'js');

  return [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        cacheDirectory: true,
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader' },
        ]
      })
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                srcModule,
              ]
            }
          },
        ]
      })
    },
    {
      test: /\.html$/,
      use: [
        { loader: 'file-loader?name=templates/[name].[hash].html' },
        { loader: 'extract-loader' },
        {
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeAttributeQuotes: false,
            keepClosingSlash: true,
            minifyCSS: true,
            minifyJS: true,
            useShortDoctype: false,
            removeStyleTypeAttributes: false,
            removeScriptTypeAttributes: false,
            removeCommentsFromCDATA: true,
            removeCDATASectionsFromCDATA: false,
          }
        },
      ],
      exclude: /[\/]index\.tpl\.html$/
    }
  ];
};
