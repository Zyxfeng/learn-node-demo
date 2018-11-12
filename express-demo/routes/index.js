const express = require('express')

const router = express.Router();

const userDao = require('../dao/userDao');

router.get('/', (req, res, next) => {
    res.send(`<h1>Hello express</h1>`);
});

router.get('/addUser', (req, res, next) => {
    userDao.add(req, res, next);
});

router.get('/users', (req, res, next) => {
    userDao.queryAll(req, res, next);
});

router.get('/user/:id', (req, res, next) => {
    userDao.queryById(req, res,next);
});

router.get('/delUser/:id', (req, res, next) => {
    userDao.delete(req, res, next);
});

router.get('/updateUser', (req, res, next) => {
    userDao.update(req, res, next);
});

module.exports = router;