'use strict';
const mongoose = require('mongoose');
const Helpdesk = mongoose.model('Helpdesk');

/**
 * Controller for Helpdesk responses.
 * Implements standard CRUD operations.
 */

// List all responses
exports.list_all_responses = async (req, res) => {
    try {
        const responses = await Helpdesk.find({});
        res.json(responses);
    } catch (err) {
        res.status(500).send(err);
    }
};

// Create a new response
exports.create_a_response = async (req, res) => {
    try {
        const new_response = new Helpdesk(req.body);
        const response = await new_response.save();
        res.status(201).json(response);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Read a single response
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

// Update a response
exports.update_a_response = async (req, res) => {
    try {
        const response = await Helpdesk.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!response) {
            return res.status(404).json({ message: 'Response not found' });
        }
        res.json(response);
    } catch (err) {
        res.status(400).send(err);
    }
};

// Delete a response
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
