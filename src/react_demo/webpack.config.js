var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './demo1/app.js'),
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loader: 'babel-loader'
    }
    // , {
    //   test: /\.css$/,
    //   loader: 'style!css'
    // }, {
    //   test: /\.less$/,
    //   loader: 'style!css!less'
    // },{
    //   test: /\.(png|jpg)$/,
    //   loader: 'url?limit=25000'
    // }
    ]
  }
};