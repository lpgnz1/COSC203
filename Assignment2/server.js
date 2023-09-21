const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const pool = require('./db');

/* create the server */
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

/* host public/ directory to serve: images, css, js, etc. */
app.use(express.static('public'));

/* path routing and endpoints */
app.use('/', require('./path_router'));

app.post('/birds/edit', async (request, response) => {
    const primary_name = request.body.Primary_Name;
    const english_name = request.body.English_Name;
    const scientific_name = request.body.Scientific_Name;
    const order = request.body.Order;
    const family= request.body.Family;
    const length = request.body.Length;
    const weight = request.body.Weight;
    const status_name = request.body.status_name;
    const photographer = request.body.photographer;
    const photo_upload = request.body.photo_upload;
    const photo_source = request.body.photo_source;
    const bird_id = request.body.bird_id;

    status_id_query = `SELECT status_id FROM ConservationStatus WHERE status_name = "${status_name}" INTO @status_id;`
    bird_update_query = `UPDATE Bird 
                         SET primary_name="${primary_name}", english_name="${english_name}", 
                             scientific_name="${scientific_name}", order_name="${order}",
                             family="${family}", length=${length}, weight=${weight}
                         WHERE Bird.bird_id = ${bird_id};`

    const db = pool.promise();
    const update = await db.query(bird_update_query);

    response.redirect('/');
});

/* start the server */
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});