const Router = require('koa-router');
const router = new Router();

const useStatic = require('./upload/uploadRequest');

const uploadRespone = require('./upload/uploadRespone');

const path = require('path');
const fs = require('fs');

router
.get('/', async (ctx, next) => {
    // readFileSync 读  writeFileSync 写
    const templatePage = fs.readFileSync(path.resolve('./page/index.html'), 'utf-8');
    // 读取这个路径下的系统信息，用isDirectory判断是否为文件
    const template = fs.lstatSync(path.resolve('./page'));
    console.log(template, template.isDirectory());
    ctx.body = templatePage;
})
.get('/api/', (ctx, next) => {
    ctx.body = 'Hello World!';
})
.get('/api/test', (ctx, next) => {
    ctx.body = {
        msg: 'here is test',
        query: ctx.query,
        queryStr: ctx.querystring,
    }
})
.post('/api/users', (ctx, next) => {
    ctx.body = 'here is users';
})
// .get('/upload/:img', (ctx) => {
//     console.log(ctx)
//     ctx.body = 'ok';
// })

// 访问静态资源 /upload 静态资源路径
// 匹配 /upload/{2-64位名称}(.png/.jpeg/.jpg)
.get(/^\/upload+\/+([A-Za-z0-9]{2,64})((.png)|(.jpeg)|(.jpg))$/i, useStatic)
.post(
    '/upload',
    async (ctx, next) => {
        // 文件大小
        const size = ctx.request.header['content-length'];
        if (size / 1024 > 10 ) {
            return ctx.body = {
                status: 400,
                message: '上传图片过大～',
                date: new Date(),
            };
        }
        await next();
    }, 
    uploadRespone.single('file'),
    async (ctx) => {
        const { path } = ctx.request.file;
        const { headers } = ctx.req;
        const { size } = ctx.file;
        if (size / 1024 < 10 ) {
            ctx.body = {
                status: 200,
                data: `http://${headers.host}/${path}`,
                message: 'ok',
                date: new Date(),
            };
        }
    }
)
.all('/api/users/:id', (ctx, next) => {
    ctx.body = {
        msg: 'here is test',
        params: ctx.params,
    }
});


module.exports = router