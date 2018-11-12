const express = require('express');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
    console.log(`User service is about to check if user ${req.params.id} exist`);
    if (req.params.id == 0) res.send(true);
    else res.send(false);
});

module.exports.API = router;