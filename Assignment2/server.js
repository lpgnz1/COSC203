const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const pool = require('./db');
const fs = require('fs');
const formidable = require('formidable');

/* create the server */
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));

/* host public/ directory to serve: images, css, js, etc. */
app.use(express.static('public'));

/* path routing and endpoints */
app.use('/', require('./path_router'));

app.post('/birds/edit', async (request, response) => {
    // Create a new instance of formidable to parse the request
    const form = new formidable.IncomingForm();

    // Wrap the form.parse callback in a promise
    const parseFormPromise = () => {
        return new Promise((resolve, reject) => {
            form.parse(request, (err, fields, files) => {
                
                resolve({ fields, files });
                
            });
        });
    };

    try {
        
        // Parse the form data and await the result
        const { fields, files } = await parseFormPromise();

        // Extract the uploaded file (if any)
        const uploadedFile = files.photo_upload[0];

        // Assign variables for form data entires
        var photo_source = '';
        const primary_name = fields.Primary_Name[0];
        const english_name = fields.English_Name;
        const scientific_name = fields.Scientific_Name;
        const order = fields.Order;
        const family= fields.Family;
        const length = fields.Length;
        const weight = fields.Weight;
        const status_name = fields.status_name;
        const photographer = fields.photographer;
        const bird_id = fields.bird_id;
        
        // Check if a file was uploaded, else keep filename that is already there
        if (Object.keys(files).length != 0){
            photo_source = uploadedFile.originalFilename;
        } else {
            photo_source = fields.photo_source;
        }
        
        // Specify the destination path where you want to save the file
        const destinationPath = './public/images/' + photo_source;

        // Create a write stream to save the file
        const writeStream = fs.createWriteStream(destinationPath);

        // Use a readable stream to access the file data
        const readableStream = fs.createReadStream(uploadedFile.filepath);

        // Pipe the readable stream to the write stream to save the file
        readableStream.pipe(writeStream);

        // Handle write stream events
        writeStream.on('finish', () => {
            console.log('File saved successfully');
            // File saved successfully; you can do further processing here
        });

        writeStream.on('error', (err) => {
            console.error('Error saving file:', err);
            // Handle the error (e.g., send an error response)
        });

        const db = pool.promise();
        
        // First, get the status_id based on status_name
        const [statusRows] = await db.query('SELECT status_id FROM ConservationStatus WHERE status_name = ?;', [status_name]);
        const status_id = statusRows[0].status_id;

        try {
            // Update Bird table
            await db.query(
                'UPDATE Bird SET primary_name = ?, english_name = ?, scientific_name = ?, order_name = ?, family = ?, length = ?, weight = ?, status_id = ? WHERE bird_id = ?;',
                [primary_name, english_name, scientific_name, order, family, length, weight, status_id, bird_id],
                function (err, result) {
                    if (err) throw err;
                    console.log(result.affectedRows + " record(s) updated");
                }
            );

            // Update Photos table
            await db.query(
                'UPDATE Photos SET photographer = ?, filename = ? WHERE bird_id = ?',
                [photographer, photo_source, bird_id]
            );
        } catch (err) {
            console.error('SQL Error:', err);
            response.status(500).send('Error updating the database');
            return;
        }

        // return to home page
        response.redirect('/');

        } catch(err) {
            console.log(err);
            console.log("Update SQL broke");
        }
    });

/* start the server */
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});