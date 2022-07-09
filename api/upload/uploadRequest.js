const koaStatic = require('koa-static'); //静态内容

// 创建静态资源目录实现预览 './'设置更路径, 让路由匹配决定路径
const upload = koaStatic('./', {
    setHeaders: (res, path, static) => {
        if (path.indexOf(/[jpg/png/jpeg/gif]/) > -1) {
            // 缓存时长120s
            res.setHeader('Cache-Control', ['private', 'max-age=120'])
        };
    },
});
module.exports = upload;