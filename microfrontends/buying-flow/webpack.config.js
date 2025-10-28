const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = (env) => ({
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json',
          transpileOnly: true
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'buying-flow.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: env?.standalone ? 'var' : 'module',
    library: env?.standalone ? 'buyingFlow' : undefined,
    module: !env?.standalone,
  },
  experiments: {
    outputModule: !env?.standalone,
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  externals: env?.standalone ? {} : [
    'react',
    'react-dom',
    'react-dom/client',
    'react/jsx-runtime',
    'react/jsx-dev-runtime',
    /^react\/.*/,
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: env?.standalone ? true : false,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.REACT_APP_BACKEND_API_URL': JSON.stringify(process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/api'),
    }),
  ],
});
