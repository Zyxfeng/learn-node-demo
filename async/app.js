const math = require('./math');

math.sum(1, 2, (err, result) => {
    if (err) throw err;

    console.log('I can\'t believe the result is: ', result, '!');
    
});