const request = require('../node_modules/request')

request('http://www.baidu.com', function (error, response, body) {
    console.log('error: ', error);
    console.log('statusCode: ', response && response.statusCode);
    console.log('body: ', body);
});