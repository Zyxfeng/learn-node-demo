const async = require('asyncawait/async');
const await = require('asyncawait/await');

const fs = require('fs');
const util = require('util');
const path = require('path');

const _ = require('lodash');

const readdirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);

const countFiles = async (function (dir) {
    //打开指定的目录
    let files = await (readdirAsync(dir));
    //获得由指定目录下的所有文件的文件路径组成的数组
    let paths = _.map(files, function (file) {
        return path.join(dir, file);
    });
    //文件状态数组
    let stats = await (_.map(paths, function (path) {
        return statAsync(path);
    }));
    //过滤非文件
    return _.filter(stats, function(stat) {
        return stat.isFile();
    }).length;
});

countFiles(__dirname).then(function (num) {
    console.log(`There are ${num} files in ${__dirname}`);
}).catch(function (err) {
    console.log(`Something went wrong: ${err}`);
});