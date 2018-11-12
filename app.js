
const express = require('express');

const app = express();

const birds = require('./router');

app.get('/', (req, res) => {
    res.end('Hello express');
});

app.post('/', (req, res) => {
    res.send('Post request to the homePage');
});

app.all('/secret', (req, res, next) => {
    console.log('Accessing the secret section...');
    next();
});

app.get('/about', (req, res) => {
    res.send('about');
});

app.use('/birds', birds);

app.route('/book').get((req, res) => res.send('Get a random book')).post((req, res) => res.send('Add a book')).put((req, res) => res.send('Update the book'));

app.listen(3000, () => {
    console.log('app is listening http://localhost:3000...');
})