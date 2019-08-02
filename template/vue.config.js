// ------------------------------------------------------------------------------
// name: vue.config.js
// author: 喵大斯( h5devs.com/h5devs.net )
// created: 2019/4/23 21:00
// ------------------------------------------------------------------------------

const path = require('path');
const HappyPack = require('happypack');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const isDebug = process.env.NODE_ENV === 'development';

function resolve(...dir) {
  return path.join(__dirname, ...dir);
}

// 插件列表
const plugins = [
  // 多线程打包
  new HappyPack({
    id: 'happyBabel',
    loaders: [{ loader: 'babel-loader?cacheDirectory=true' }],
    threadPool: happyThreadPool
  })
];

// 模块打包优化 TreeShaking（Development 时无须启动，否则影响编译速度）
!isDebug && (plugins.unshift(new MinifyPlugin()));

// 配置集合
module.exports = {
  publicPath: isDebug ? '/' : './',
  outputDir: 'dist',
  assetsDir: '',
  productionSourceMap: false,

  // 调试配置
  devServer: {
    // 跨域配置
    proxy: {
      '/api': {
        target: 'http://172.16.31.16:8080',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false
      }
    }
  },

  configureWebpack: {

    entry: resolve('src/main.js'),

    // 不分割任何模块（子模块合并，因此包不能过大）
    optimization: {
      splitChunks: false
    },

    // 排除外部库（如使用CDN或引用本地JS库）
    externals: {
      // vue: 'Vue',
      // 'element-ui': 'ElementUI'
    },

    // 插件
    plugins
  },

  chainWebpack: (config) => {

    // 输出到 dist，而非 dist/static
    config.output.filename('[name].js');

    // 增加资源识别路径（仍然不支持 style="background: url()" 的路径识别）
    // config.module.rule('file').include.add('/demo/assets');

    // 路径别名
    config.resolve.alias.set('@', resolve('src'));
    config.resolve.alias.set('@mudas/example', resolve('packages/index.js'));

    // 构建若皆为 js 库，则不需要生成 html
    if (!isDebug) {
      config.plugins.delete('html');
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
    }

  }
};
