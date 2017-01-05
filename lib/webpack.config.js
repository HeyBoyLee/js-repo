var webpack = require('webpack');
var files = require('./file-list');


console.log(files);

module.exports = {
  entry: files(),
  output: {
    path: './build',
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader?{rules:{semi:0}}",
        exclude: /node_modules/,
      },
    ],
    loaders:[

    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
  ],
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    //  "jquery": "jQuery"
    'test': 'test'
  }
};