'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Helpdesk Schema
 * Represents a helpdesk response entry.
 * 
 * @property {String} issueCode - Unique identifier for the issue (Required)
 * @property {String} response - Textual response for the issue (Required)
 * @property {String} category - Category of the issue e.g., "IT", "Billing" (Required)
 */
const HelpdeskSchema = new Schema({
    issueCode: {
        type: String,
        required: 'Please enter the issue code'
    },
    response: {
        type: String,
        required: 'Please enter the response'
    },
    category: {
        type: String,
        required: 'Please enter the category'   
    }
}, {
    collection: 'responses',
    timestamps: true
});

module.exports = mongoose.model('Helpdesk', HelpdeskSchema);
