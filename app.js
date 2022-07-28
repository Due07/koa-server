// koa：用来起一个web服务器
// koa2-cors: 解决跨域问题
// koa-router: koa的路由处理
// koa-body： koa参数的获取 帮助解析 http 中 body 的部分的中间件，包括 json、表单、文本、文件等
// koa-static: 静态内容
// @koa/multer multer:图片上传的插件
const Koa = require('koa');
const app = new Koa();

const koaBody = require('koa-body');
// const bodyParser = require('koa-bodyparser');

const koaCors = require('koa2-cors');


const consola = require('consola')
const router = require('./api/index')



async function start() {
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        consola.start({
            message: `开始啦～, ${ctx.method} ${ctx.url} - ${ms}ms`,
            badge: true,
        });
    })
    // .use(bodyParser())
    .use(koaBody({
        multipart: true, // 解析多个文件
        // formLimit // 表单请求体大小
    }))
    .use(router.routes())
    .use(router.allowedMethods()) // allowedMethods()中间件主要用于处理options请求，响应405和501状态。 
    .use(koaCors()); // 解决跨域

    app.listen(3000, '127.0.0.1', () => {
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