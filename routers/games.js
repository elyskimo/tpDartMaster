const router = require('express').Router();

router.get('/:id/edit', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.get('/:id/players', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.post('/:id/players', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.delete('/:id/players', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.delete('/:id/shots/previous', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.post('/:id/shots', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.get('/:id', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.patch('/:id', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.delete('/:id', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.get('/new', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.get('/', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

router.post('/', (req, res, next) => {
    console.log('Correspond à /games');
    res.send("GAMES");
});

module.exports = router;
