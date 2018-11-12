const express = require('express');
const router = express.Router();
const app = express();

const bodyParser = require('body-parser');
const Validator = require('json-schema').Validator;
const knex = require('knex');

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`app is listening at ${port}...`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<img src="https://i.pinimg.com/originals/0d/68/02/0d68025b2cd9a144d201d6cea02e7f27.jpg" />');
})

app.use((req, res, next) => {
    console.log(`New request ${req.url}`);
    req.country = 'Israel';
    next();
});

router.get('/api/products', async (req, res) => {
    throw new Error('ABC');
    const promise = await new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('boo'));
        });
    });

    if (req.country === 'Israel') {
        console.log('Yay israel');
        res.json([{
            name: 'iPhone'
        }, {
            name: 'galaxy'
        }]);
    }
});

app.use(function (err, req, res, next) {
    console.log("Error caught");
});

router.post('/api/products', (req, res) => {
    console.log(`The prodcuts is ${req.body}`);
    res.json(req.body);
    const schema = {
        "id": "/Product",
        "type": "object",
        "properties": {
            "name": {
                "type": "string"
            },
            "numOfSales": {
                "type": "integer",
                "minimum": 1
            },
            "type": {
                "type": {
                    "enum": ["home", "business"]
                }
            }
        },
        "required": ["name", "numOfSales"]
    };
    const v = new Validator();
    if (v.valdate(req.body, schema).errors.length > 0) {
        res.status(400).end();
    }
    knex({
        client: 'pg',
        connection: {
            host: process.env.POSTGRES_HOST || 'localhost',
            port: '5432',
            database: 'shopishop',
            user: process.env.POSTGRES_USER || 'shopishop',
            password: process.env.POSTGRES_PASSWORD || 'shopishop'
        }
    }).insert(req.body).into('products').then(id => console.log(id));
});

app.use(router);