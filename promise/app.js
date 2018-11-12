const request = require('request');
const hget = require('hget');

function getRandomPonyFooArticle() {
    return new Promise((resolve, reject) => {
        request('https://ponyfoo.com/articles/random', (err, res, body) => {
            if (err) {
                reject(err); return;
            }
            resolve(body);
        })
    })
}

printRandomArticle();

function printRandomArticle() {
    getRandomPonyFooArticle().then(html => {
        hget(html, {
            markdown: true,
            root: 'main',
            ignore: '.at-subscribe, .mm-comments, .de-sidebar'
        })
    }).then(md => marked(md, {
        renderer: new Term()
    })).then(txt => console.log(txt)).catch(reason => console.log(reason));
}