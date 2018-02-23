const path = require('path');

function build(env) {
  const rules = require('./config/webpack/rules.js')(__dirname);
  const plugins = require('./config/webpack/plugins.js')(__dirname, env);
  const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true&path=http://localhost:8012/__webpack_hmr&__assets_store';

  return {
    entry: {
      app: [
        path.join(__dirname, 'js/app.js'),
        hotMiddlewareScript
      ],
      vendors: [
        path.join(__dirname, 'js/vendors.js'),
        hotMiddlewareScript
      ],
    },
    output: {
      path: path.resolve(__dirname, 'www'),
      publicPath: '/',
      pathinfo: true,
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js'
    },
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['.js', '.min', '.min.js', '.json', '.html'],
      mainFields: ['browser', 'module', 'index'],
      descriptionFiles: ['package.json'],
      modules: [
        'node_modules',
        path.join(__dirname, 'js'),
      ],
      symlinks: false
    },
    module: {
      rules: rules
    },
    plugins: plugins,
    target: 'web',
    stats: {
      colors: true,
      depth: true,
      chunks: true,
      chunkModules: false,
      chunkOrigins: false,
      context: path.join(__dirname, 'js'),
      maxModules: 20,
      modules: false,
      moduleTrace: true,
      performance: true,
      publicPath: false,
    },
    node: {
      fs: 'empty',
      console: true,
      global: true,
      process: true
    }
  };
}


module.exports = build
