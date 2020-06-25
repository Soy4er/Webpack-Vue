const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const fs = require('fs');

const isDevelopment = process.env.mode === 'dev';

// основная конфигурация
const config = {
  mode: isDevelopment ? 'development' : 'production',

  // параметры входа
  entry: {
    polyfill: '@babel/polyfill',
    main: path.join(__dirname, 'src/main.js'),
  },

  // параметры выходного пути
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[hash].js',
  },

  // тип выводимых данных
  stats: 'errors-warnings',

  optimization: {
    minimize: !isDevelopment,
  },

  resolve: {
    extensions: ['.js', '.vue'],

    alias: {
      '@': path.join(__dirname, 'src'),
      assets: path.join(__dirname, 'src/assets'),
      images: path.join(__dirname, 'src/assets/images'),
      icons: path.join(__dirname, 'src/assets/icons'),
      fonts: path.join(__dirname, 'src/assets/fonts'),
      components: path.join(__dirname, 'src/components'),
      pages: path.join(__dirname, 'src/pages'),

      // определяем какая библиотека будет загружена, при подключении модуля vue
      vue$: isDevelopment ? 'vue/dist/vue.runtime.js' : 'vue/dist/vue.runtime.min.js',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: ['vue-loader', 'eslint-loader'],
        include: [path.join(__dirname, 'src')],
      },
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        include: [path.join(__dirname, 'src')],
      },
      {
        test: /\.css$/,
        use: [
          isDevelopment ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isDevelopment ? 'vue-style-loader' : MiniCSSExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: isDevelopment } },
          {
            loader: 'sass-loader',
            options: {

              sourceMap: isDevelopment,
              sassOptions: {
                includePaths: ['src/assets/scss/import.scss'],
              },

              prependData() {
                const variables = fs.readFileSync(path.resolve(__dirname, 'src/assets/scss/import.scss'));
                return variables;
              },
            },
          },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|gif|png|jpe?g)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ],
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    new VueLoaderPlugin(),
    new HtmlPlugin({ template: 'index.html' }),
    new MiniCSSExtractPlugin({
      filename: 'css/app.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/static', noErrorOnMissing: true },
      ],
    }),
  ],
};

// дополнительные prod
const productionConfig = {};

// параметры для dev
const developmentConfig = {
  devServer: {
    historyApiFallback: true,
    watchContentBase: false,
    open: false,
    hot: false,
    overlay: true,
    port: 8000,
  },
};

module.exports = merge(config,
  isDevelopment ? developmentConfig : productionConfig);
