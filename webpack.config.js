const path = require('path');
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

// const ExtractLess = new ExtractTextPlugin({
//     filename: 'css/[name].css?v=[hash:8]',
//     allChunks: true
// });

let obj = {

  // 'c': {
  //   distDirecotry: 'countdown',
  //   dist: 'dist',
  //   entry: {
  //     'jquery': './node_modules/jquery/dist/jquery.min.js',
  //     'countdown.jquery': './src/countdown/countdown.js'
  //   },
  //   html: (
  //     new HtmlWebpackPlugin({
  //       filename: 'demo.html', //配置输出文件名和路径
  //       template: './src/countdown/demo.html', //配置文件模板
  //       chunksSortMode: 'manual', // 设置排序
  //       chunks: ['jquery', 'countdown.jquery'], // 设置js
  //       minify: true,
  //       cache: false,
  //       inject: 'body'
  //     })
  //   )
  // },
  'c': {
    distDirecotry: 'floor',
    dist: 'dist',
    entry: {
      'jquery': './node_modules/jquery/dist/jquery.min.js',
      'floor.jquery': './src/floor/floor.js'
    },
    html: (
      new HtmlWebpackPlugin({
        filename: 'demo.html', //配置输出文件名和路径
        template: './src/floor/demo.html', //配置文件模板
        chunksSortMode: 'manual', // 设置排序
        chunks: ['jquery', 'floor.jquery'], // 设置js
        minify: true,
        cache: false,
        inject: 'body'
      })
    )
  },

};

let o = obj.c;

let distDirecotry = 'floor'; 
let dist = o.dist;

module.exports = {
  entry: o.entry,
  output: {
    path: path.resolve(__dirname, distDirecotry),
    filename: dist + '/[name].js?v=[hash:8]',
    publicPath: "/"
  },

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ],
  },

  module: {
    rules: [{
        test: require.resolve('./node_modules/jquery/dist/jquery.min.js'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      },
      {
        test: require.resolve('./src/countdown/countdown.js'),
        use: [{
          loader: 'expose-loader',
          options: 'yCountdown'
        }]
      },
      {
        test: require.resolve('./src/floor/floor.js'),
        use: [{
          loader: 'expose-loader',
          options: 'Floor'
        }]
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [{
            'loader': 'babel-loader',
            options: {
              presets: ['env']
            },
          }
        ],
        exclude: /node-modules/
      },
      {
        'test': /\.(less|css)$/,
        include: [
          path.resolve(__dirname, 'src')
        ],

        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              "plugins": (loader) => [
                require("autoprefixer")({
                  browsers: 'cover 99.5%'
                })
              ]
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        'test': /\.(?:png|jpe?g|gif|svg|eot|woff|woff2|ttf)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: dist + '/static/'
          }
        }]
      },
    ]
  },

  //代码模块路径解析的配置
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
  },
  //插件
  plugins: [
    //使用 uglify-webpack-plugin 来压缩JS代码
    new UglifyJsPlugin({
      test: /\.(js)$/i,
      parallel: 4,
      sourceMap: false,
      uglifyOptions: {
        compress: true,
        minify: true
      }
    }),
    o.html,
    new MiniCssExtractPlugin({
      filename: "[name].css?v=[hash:6]",
      chunkFilename: "[name].css"
    }),

    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.(less|css)$/i,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),

    // new BundleAnalyzerPlugin({ analyzerPort: 8019 })
  ]
};