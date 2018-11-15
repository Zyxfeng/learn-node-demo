const Koa = require('koa');
const bodyParser = require('koa-parser');

const routes = require('./routes');

const app = new Koa();

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`);
    next();
});

app.use(bodyParser());

app.use(routes());

app.listen(3000, () => console.log('app is listening at http://127.0.0.1:3000...'));