// ------------------------------------------------------------------------------
// name: vue.config.js
// author: 喵大斯( h5devs.com/h5devs.net )
// created: 2019/4/23 21:00
// ------------------------------------------------------------------------------

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

// const isDebug = process.env.NODE_ENV === 'development';

function resolve(...dir) {
  return path.join(__dirname, ...dir);
}

module.exports = {
  productionSourceMap: false,

  configureWebpack: {

    entry: resolve('src/main.js'),

    // 不分割任何模块
    optimization: {
      splitChunks: false
    },

    // 排除 'element-ui'
    externals: [{
      Vue: 'vue',
      ElementUI: 'element-ui'
    }],

    // 输出设置
    output: {
      filename: '[name].js',
      chunkFilename: '[name].[contenthash:8].js'
    },

    // 复制插件
    plugins: [
      // new CopyPlugin(['packages/readme.txt']),
      new HappyPack({
        id: 'happyBabel',
        loaders: [{ loader: 'babel-loader?cacheDirectory=true' }],
        threadPool: happyThreadPool
      })
    ]
  },

  chainWebpack: (config) => {

    // 路径别名
    config.resolve.alias.set('@', resolve('src'));
    config.resolve.alias.set('@mudas/example', resolve('packages/index.js'));

    // 不生成 html
    // config.plugins.delete('html');
    // config.plugins.delete('preload');
    // config.plugins.delete('prefetch');

  }
};
