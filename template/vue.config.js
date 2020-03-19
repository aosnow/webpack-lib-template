// ------------------------------------------------------------------------------
// name: vue.config.js
// author: 喵大斯( h5devs.com/h5devs.net )
// created: 2019/4/23 21:00
// ------------------------------------------------------------------------------

const path = require('path');
const isDebug = process.env.NODE_ENV === 'development';

function resolve(...dir) {
  return path.join(__dirname, ...dir);
}

// 排除所有不必要的模块，让宿主环境去安排必要的第三方包
const regexp = /^(core-js)/i;
const externals = isDebug ? '' : [regexp];

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

  css: {
    // 强制将所有 css 内容内联
    // 对于 lib 的打包不宜输出独立的 css 文件
    extract: false
  },

  configureWebpack: {

    entry: resolve('src/main.js'),

    // 不分割任何模块（子模块合并，因此包不能过大）
    optimization: {
      // 生产环境时压缩代码
      minimize: !isDebug,

      // 开发时爱怎么分割怎么分，少做点合并包的事应该会快点吧
      splitChunks: isDebug ? {} : false
    },

    // 排除外部库以及不需要打包的 node_modules 第三方包（如使用CDN或引用本地JS库）
    // 作为一个合格成熟的 lib，应该学会让用你的人去安装第三方包
    externals
  },

  chainWebpack: (config) => {

    // 输出到 dist，而非 dist/static
    config.output.filename('[name].js');

    // 增加资源识别路径（仍然不支持 style="background: url()" 的路径识别）
    // config.module.rule('file').include.add('/demo/assets');

    // 路径别名
    config.resolve.alias.set('@', resolve('src'));

    // 开发阶段的别名
    config.resolve.alias.set('{{#if namespace}}{{namespace}}/{{/if}}{{ name }}', resolve('packages'));

    // 打包后的测试别名
    // config.resolve.alias.set('{{#if namespace}}{{namespace}}/{{/if}}{{ name }}', resolve('dist/{{ name }}.common.js'));

    // 构建若皆为 js 库，则不需要生成 html
    if (!isDebug) {
      config.plugins.delete('html');
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
    }

  }
};
