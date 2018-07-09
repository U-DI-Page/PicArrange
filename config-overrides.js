const { injectBabelPlugin } = require('react-app-rewired');
const rewireCssModules=require('react-app-rewire-css-modules');
const path=require('path');

function resolve(dir){
    return path.join(__dirname,'.',dir);
}

module.exports = function override(config, env) {
    // 注入antd样式
    // config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config);
    // 添加.sass .scss文件加载
    config = rewireCssModules(config,env);
    return config;
};

