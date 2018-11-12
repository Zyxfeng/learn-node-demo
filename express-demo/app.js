const express = require('express')

const router = require('./routes');

const bodyParser = require('body-parser');

const app = express();

app.listen(3000, () => console.log('app is listening at http://127.0.0.1:3000...'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(router);