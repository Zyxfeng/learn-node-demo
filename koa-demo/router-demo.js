
const Koa = require('koa');
const fn_router = require('koa-router');
const router = fn_router();

const app = new Koa();

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    next();
});

router.get('/', async (ctx, next) => {
    ctx.response.type = 'text/html';
    ctx.response.body = `<h1>Koa Router Index</h1>`;
});

router.get('/hello/:name', async (ctx, next) => {
    ctx.response.body = `<h1>Hello ${ctx.params.name}</h1>`;
});

app.use(router.routes());

app.listen(3000, () => console.log(`app is listening at http://127.0.0.1:3000`));