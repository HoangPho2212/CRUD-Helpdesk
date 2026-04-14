/**
 * server.js - Backend Entry Point
 * This file initializes the Express server, connects to the database, 
 * and sets up the middleware that powers our API.
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Step 1: Register the Data Model
// We must require the model here so Mongoose knows it exists before we use it in routes
const Helpdesk = require('./api/models/helpdeskModel'); 

const app = express();
const port = process.env.PORT || 3000;

// Step 2: Database Connection
// We connect to a local MongoDB instance. 127.0.0.1 is used for better stability.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/helpdeskdb')
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB. Exiting now...', err);
        process.exit();
    });

// Step 3: Middleware Configuration
// CORS: Allows our Vue frontend (on port 5173) to communicate with this API
app.use(cors());
// Body-Parser: Converts incoming request data into JSON format so we can read it in the controller
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Step 4: Route Registration
// Import and initialize the routes defined in our routes file
const routes = require('./api/routes/helpdeskRoutes');
routes(app);

// Step 5: 404 Fallback
// If a user tries to access a URL that doesn't exist, we return a 404 error
app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Step 6: Start Listening
app.listen(port, () => {
    console.log(`Helpdesk RESTful API server started on: ${port}`);
});

module.exports = app; // Exported for automated testing purposes
