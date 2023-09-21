const express = require('express'); // import express module
const path = require('path');
const birds_router = require('./birds_router');
const bodyParser = require('body-parser');

const app = express(); // create an express server instance
const PORT = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/birds/', birds_router);
app.use('/', express.static(path.resolve(__dirname, 'public')));

app.post('/submit_login', (request, response) => {
    const user = request.body.user;
    const pass = request.body.pass;

    // in practice, we would check a database for the username/password
    if (user === "admin" && pass === "password123") {
        // if login matches, load success.html
        response.redirect('./public/success.html'); 
    } else {
        // if login fails, load login.html 
        response.redirect('./public/login.html');  
    }
});

app.get('/test', (request, response) => {
    const id = request.query.animal;
    response.send('Your patronus is a: ' + id);
});

app.get('/time', (request, response) => {
    const datetime = new Date().toISOString();

    const dynamic_html = `<h1>The server time is ${datetime}</h1>`
    
    response.send(dynamic_html);
});

app.get('*', (request, response) => {
    response.status(404) 
    response.sendFile(path.resolve(__dirname, 'public/404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is live! http://localhost:${PORT}`)
}); // start the server on port 8080