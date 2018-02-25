const express = require('express');
const app = express();
const path = require('path');

const port = 8012;
const bundlePath = path.join(process.cwd(), 'www');

const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config.js')('dev');
const compiler = webpack(config);

compiler.plugin('done', function (stats) {
  const time = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

  console.info(`Build info:\t${stats.compilation.errors.length} errors in ${time}s`);

  if (stats.compilation.errors.length === 0) {
    console.info(`🌎 Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
  }
});

const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: false,
  quiet: false,
  lazy: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  stats: {
    assets: false,
    cached: true,
    children: true,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    maxModules: 20,
    errorDetails: true,
    hash: false,
    modules: false,
    moduleTrace: true,
    performance: true,
    publicPath: false,
    reasons: false,
    timings: true,
  }
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));

app.get('*', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(
    path.join(bundlePath, 'index.html')
  ));
  res.end();
});


// app.use('/js', express.static(__dirname + '/js'));

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });

app.listen(port);
