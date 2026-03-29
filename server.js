const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Register the Model
const Helpdesk = require('./api/models/helpdeskModel'); 

const app = express();
const port = process.env.PORT || 3000;

// Mongoose connection setup
// Using 127.0.0.1 for better compatibility on some systems
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/helpdeskdb')
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(err => {
        console.error('Could not connect to MongoDB. Exiting now...', err);
        process.exit();
    });

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register Routes
const routes = require('./api/routes/helpdeskRoutes');
routes(app);

// 404 Fallback
app.use((req, res) => {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Helpdesk RESTful API server started on: ${port}`);
});

module.exports = app; // For testing
