const Koa = require('koa');

const app = new Koa();

app.use(async function (ctx, next) {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    await next();
});

app.use(async function (ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`Time: ${ms}`);
});

app.use(async function (ctx, next) {
    ctx.response.type = 'text/html';
    ctx.response.body = `<h1>Hello Koa</h1>`;
});

app.listen(3000, () => console.log('app is listening at http://127.0.0.1:3000'));