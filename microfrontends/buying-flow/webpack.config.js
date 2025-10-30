const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production' || process.env.NODE_ENV === 'production';
  const isStandalone = env?.standalone !== false; // Default to standalone mode
  
  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.tsx',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
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
    filename: isProduction ? '[name].[contenthash].js' : 'buying-flow.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
    libraryTarget: isStandalone ? 'var' : 'module',
    library: isStandalone ? 'buyingFlow' : undefined,
    module: !isStandalone,
  },
  experiments: {
    outputModule: !isStandalone,
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    ],
  },
  externals: isStandalone ? {} : [
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
      inject: isStandalone ? true : false,
      minify: isProduction,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'process.env.REACT_APP_BACKEND_API_URL': JSON.stringify(
        process.env.REACT_APP_BACKEND_API_URL || 
        (isProduction ? '/api' : 'http://localhost:8080/api')
      ),
    }),
    // Make React available globally in standalone mode
    ...(isStandalone ? [
      new webpack.ProvidePlugin({
        React: 'react',
      })
    ] : []),
  ],
  optimization: isProduction ? {
    splitChunks: {
      chunks: 'all',
    },
    minimize: true,
  } : {},
  };
};
