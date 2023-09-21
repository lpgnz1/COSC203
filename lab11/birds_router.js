const express = require('express'); // import express
const router = express.Router(); // create a router
const birds = require('./nzbird.json');
const { randomInt } = require('crypto');

/* we will code each individual route handler here */
// router.get(PATH, HANDLER);
// router.get(PATH, HANDLER);
router.get('/random/', (request, response) => {
    const randomIndex = randomInt(0 , (birds.length - 1));
    const data = birds[randomIndex];
    response.send(data);
});

router.get('/', (request, response) => {
    response.send(birds);
});

router.get('/sorted', (request, response) => {
    const data = birds.sort(
      (a, b) => a.size.length.value - b.size.length.value
    );

    response.send(data);
});

router.get('/penguins', (request, response) => {
    const data = birds.filter(
      (b) => b.english_name.toLowerCase().includes('penguin')
    );

    response.send(data);
});

router.get('/names', (request, response) => {
    const data = birds.map(
      (b) => b.primary_name
    );

    response.send(data);
});

router.get('/filter', (request, response) => {
    let results = birds;

    const status = request.query.status;

    if (status !== undefined) {
        results = results.filter(
          (b) => b.status.toLowerCase() === status.toLowerCase()
        );
    }
    
    response.send(results);
});

router.get('/family', (request, response) => {
    let results = birds;

    const family = request.query.family;

    if (family !== undefined) {
        results = results.filter(
          (b) => b.family.toLowerCase() === family.toLowerCase()
        );
    }
    
    response.send(results);
});
// export the router last
module.exports = router;