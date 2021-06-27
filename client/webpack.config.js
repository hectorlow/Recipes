const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const env = process.env.NODE_ENV || 'development';
const envPath = env === 'production' ? '.env' : `.env.${env}`;

module.exports = {
  // entrypoint of the project
  entry: path.join(__dirname, 'src', 'index.js'),

  // path and filename of the production build bundle
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.bundle.js',
    publicPath: '',
  },

  // set mode of webpack
  // process.env refers to machine environment variables
  // need to set NODE_ENV="devolopment" on machine to use
  mode: env,

  // resolving path to modules and components
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      screens: path.resolve(__dirname, 'src/screens'),
      components: path.resolve(__dirname, 'src/components'),
      images: path.resolve(__dirname, 'src/images'),
    },
    // search for directory named js file as entrypoint of folder
    // if there is an index.js file, use that first
    plugins: [new DirectoryNamedWebpackPlugin(true)],
  },

  // path to serve content and port number of development server
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    port: 3000,
    publicPath: 'http://localhost:3000',
    historyApiFallback: true,
  },

  // plugins
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new Dotenv({
      path: envPath,
    }),
  ],

  // modules describe how to handle imported files
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)/i,
        use: ['file-loader'],
      },
    ],
  },
};
