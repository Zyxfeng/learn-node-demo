// const async = require('../node_modules/async');

const waterfall = require('async/waterfall');

const math = require('./math');


waterfall([(next) => math.sum(1, 2, next), (result, next) => math.sum(result, 3, next)], (err, result) => {
    if (err) throw err;
    console.log(`I can't believe the result is: ${result}!`);
});
