const fn_index = async (ctx, next) => {
    ctx.response.body = `<h1>Index</h1>`;
}

const fn_hello = async (ctx, next) => {
    ctx.response.body = `<h1>Hello ${ctx.params.name}</h1>`;
}

module.exports = {
    'GET /': fn_index,
    'GET /hello/:name': fn_hello
}