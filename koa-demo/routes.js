const path = require('path');
const fs = require('fs');
const router = require('koa-router')();

function addMapping(router, mapping) {
    for (let url in mapping) {
        if (url.startsWith('GET ')) {
            const path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`Register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            const path = url.substring(5);
            router.post(path, mapping(url));
            console.log(`Register URL mapping: POST ${path}`);
        } else {
            console.log(`Invalid URL: ${url}`);
        } 
    }
}

function addContllers(router, controllers_dir) {
     const files = fs.readdirSync(controllers_dir);
     const js_files = files.filter((f) => {
         return f.endsWith('.js');
     });

     for (let f of js_files) {
         console.log(`process controller: ${f}`);
         let mapping = require(path.join(controllers_dir, f));
         addMapping(router, mapping);
     }
}

module.exports = function (controllers_dir) {
    let dir = controllers_dir || path.join(__dirname, 'controller');
    addContllers(router, dir);
    return router.routes();
}