// ------------------------------------------------------------------------------
// name: vue.config.js
// author: 喵大斯( h5devs.com/h5devs.net )
// created: 2019/4/23 21:00
// ------------------------------------------------------------------------------

const path = require('path');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const isDebug = process.env.NODE_ENV === 'development';

function resolve(...dir) {
  return path.join(__dirname, ...dir);
}

// 排除所有不必要的模块，让宿主环境去安排必要的第三方包
const regexp = /^(core-js)/i;
const externals = isDebug ? '' : [
  function(context, request, callback) {
    if (regexp.test(request)) {
      return callback(null, 'commonjs ' + request);
    }
    callback();
  }
];

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
      // 生产打包时压缩 js
      minimize: !isDebug,
      // 开发时爱怎么分割怎么分，少做点合并包的事应该会快点吧
      splitChunks: isDebug ? {} : false
    },

    // 排除外部库以及不需要打包的 node_modules 第三方包（如使用CDN或引用本地JS库）
    // 作为一个合格成熟的 lib，应该学会让用你的人去安装第三方包
    externals,

    // 插件
    plugins: [
      new HappyPack({
        id: 'happyBabel',
        loaders: [{ loader: 'babel-loader?cacheDirectory=true' }],
        threadPool: happyThreadPool
      })
    ]
  },

  chainWebpack: (config) => {

    // 输出到 dist，而非 dist/static
    config.output.filename('[name].js');

    // 增加资源识别路径（仍然不支持 style="background: url()" 的路径识别）
    // config.module.rule('file').include.add('/demo/assets');

    // 路径别名
    config.resolve.alias.set('@', resolve('src'));

    // 开发阶段的别名
    config.resolve.alias.set({{#namespace}}'{{namespace}}/{{ name }}'{{else}}'{{ name }}'{{/namespace}}, resolve('packages'));

    // 打包后的测试别名
    // config.resolve.alias.set({{#namespace}}'{{namespace}}/{{ name }}'{{else}}'{{ name }}'{{/namespace}}, resolve('dist/{{ name }}.common.js'));

    // 构建若皆为 js 库，则不需要生成 html
    if (!isDebug) {
      config.plugins.delete('html');
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
    }

  }
};
