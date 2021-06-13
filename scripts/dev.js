const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const path = require('path');
const config = require('./webpack.dev.config');
require('dotenv').config();

const PORT = process.env.PORT;

const compiler = webpack(config);
compiler.hooks.done.tap('ProgressPlugin', (ctx, entry) => {
  setTimeout(() => {
    console.clear();
    console.log(`\nServer running at: http://localhost:${PORT}\n`);
  });
});

const app = express();

app
  .use(webpackDevMiddleware(compiler, {
    publicPath: '/'
  }))
  .use(webpackHotMiddleware(compiler))
  .use('*', (req, res, next) => {
    compiler.outputFileSystem.readFile(path.join(compiler.outputPath, 'index.html'), (err, result) => {
      if (err) {
        return next(err);
      }
      res.set('content-type','text/html');
      res.send(result);
      res.end();
    });
  })
  .listen(PORT);