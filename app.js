// koa：用来起一个web服务器
// koa2-cors: 解决跨域问题
// koa-router: koa的路由处理
// koa-body： koa参数的获取
// koa-static: 静态内容
// @koa/multer multer:图片上传的插件
const Koa = require('koa');
const app = new Koa();

const koaBody = require('koa-body');

const koaCors = require('koa2-cors');


const consola = require('consola')
const router = require('./api/index')



async function start() {
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log('开始啦～', `${ctx.method} ${ctx.url} - ${ms}ms`);
    })
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods()) // allowedMethods()中间件主要用于处理options请求，响应405和501状态。 
    .use(koaCors()); // 解决跨域

    app.listen(3000, () => {
        consola.ready({
            message: `Server listening on 3000`,
            badge: true
        });
    });

    app.on('error', (error) => {
        consola.error({
            message: error,
        });
    })
};

start();