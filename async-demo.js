const async = require('async')
const fs = require('fs')

async.map(['app.js', 'package.json'], fs.stat, (err, results) => {
    if (err) throw err;
    console.log(results);
});