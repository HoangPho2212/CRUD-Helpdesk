'use strict';
module.exports = function(app) {
    const helpdesk = require('../controllers/helpdeskController');

    // Helpdesk Routes
    app.route('/responses')
        .get(helpdesk.list_all_responses)
        .post(helpdesk.create_a_response);

    app.route('/responses/random')
        .get(helpdesk.get_random_response);

    app.route('/responses/count')
        .get(helpdesk.get_count);

    app.route('/responses/:id')
        .get(helpdesk.read_a_response)
        .put(helpdesk.update_a_response)
        .delete(helpdesk.delete_a_response);
};
