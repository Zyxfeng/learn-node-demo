const express = require('express');
const bodyParser = require('body-parser');

const accountComponent = require('./services/account').API;
const productComponent = require('./services/product').API;

// const errorManagement = require('errorManagement');

console.log(`App is currently starting`);

let app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.use('/api/account', accountComponent);
app.use('/api/product', productComponent);

app.listen(3000, () => {
    console.log('app is listening at http://127.0.0.1:3000');
});