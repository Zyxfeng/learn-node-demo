const api = {
    sum(a, b, done) {
        process.nextTick(() => done(null, a + b));
    }
}

module.exports = api;