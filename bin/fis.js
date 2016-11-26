#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
  name: 'fis3',
  processTitle: 'fis',
  moduleName: 'fis3',
  configName: 'fis-conf',

  // only js supported!
  extensions: {
    '.js': null
  }
});

cli.launch({
  cwd: argv.r || argv.root, // 执行fis3的目录
  configPath: argv.f || argv.file //配置路径
}, function(env) {
  // env为环境变量
  // 定义fis对象
  var fis;
  // modulePath: "...lib/node_modules/fis3/index.js" 即入口文件
  if (!env.modulePath) {
    fis = require('../');
  } else {
    // 加载fis入口文件
    fis = require(env.modulePath);
  }

  // 拼接得到完整命令行及命令行对应的目录
  process.title = this.name +' ' + process.argv.slice(2).join(' ') + ' [ ' + env.cwd + ' ]';

  // 配置插件查找路径，优先查找本地项目里面的 node_modules
  // 然后才是全局环境下面安装的 fis3 目录里面的 node_modules
  // 这里是为了支持本地node_modules能力
  fis.require.paths.unshift(path.join(env.cwd, 'node_modules'));
  fis.require.paths.push(path.join(path.dirname(__dirname), 'node_modules'));// fis3 node_modules path
  fis.cli.name = this.name;
  // 执行命令
  fis.cli.run(argv, env);
});
