'use strict';
const mongoose = require('mongoose');
const Helpdesk = mongoose.model('Helpdesk');

/**
 * helpdeskController.js - Business Logic
 * This file contains the "Brains" of the API. It handles how data is 
 * retrieved from or saved to the MongoDB database.
 */

// 1. List All: Fetches every record in the 'responses' collection
exports.list_all_responses = async (req, res) => {
    try {
        const responses = await Helpdesk.find({});
        res.json(responses);
    } catch (err) {
        res.status(500).send(err);
    }
};

// 2. Create: Takes data from the frontend and saves a new response to the DB
exports.create_a_response = async (req, res) => {
    try {
        const new_response = new Helpdesk(req.body); //new instansce of model//
        const response = await new_response.save();
        res.status(201).json(response);
    } catch (err) {
        res.status(400).send(err);
    }
};

// 3. Read One: Finds a specific item using its unique Database ID (_id)
exports.read_a_response = async (req, res) => {
    try {
        const response = await Helpdesk.findById(req.params.id);
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json(response);
    } catch (err) {
        res.status(500).send(err);
    }
};

// 4. Update: Finds an existing record and merges it with new data from the user
exports.update_a_response = async (req, res) => {
    try {
        const response = await Helpdesk.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true } // 'new' returns the updated data, 'runValidators' ensures regex is checked
        );
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json(response);
    } catch (err) {
        res.status(400).send(err);
    }
};

// 5. Delete: Removes a record permanently from the database
exports.delete_a_response = async (req, res) => {
    try {
        const response = await Helpdesk.deleteOne({ _id: req.params.id });
        if (response.deletedCount === 0) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json({ message: 'Helpdesk response successfully deleted' });
    } catch (err) {
        res.status(500).send(err);
    }
};

// 6. Random (Quiz Feature): Counts all docs and picks 1 random one
// This is used to generate the "Question" for our Training Quiz.
exports.get_random_response = async (req, res) => {
    try {
        const count = await Helpdesk.countDocuments();
        if (count === 0) {
            return res.status(404).json({ message: 'No responses available' });
        }
        const random = Math.floor(Math.random() * count);
        const response = await Helpdesk.findOne().skip(random);
        res.json(response);
    } catch (err) {
        res.status(500).send(err);
    }
};

// 7. Count (Stats Feature): Returns the total number of records
// This powers the "Statistics" card on the System Info page.
exports.get_count = async (req, res) => {
    try {
        const count = await Helpdesk.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).send(err);
    }
};
