'use strict';

/**
 * Module dependencies
 */
var subjectsPolicy = require('../policies/subjects.server.policy'),
  subjects = require('../controllers/subjects.server.controller');

module.exports = function (app) {
  // Subjects collection routes
  app.route('/api/subjects').all(subjectsPolicy.isAllowed)
    .get(subjects.list)
    .post(subjects.create);

  // Single subject routes
  app.route('/api/subjects/:subjectId').all(subjectsPolicy.isAllowed)
    .get(subjects.read)
    .put(subjects.update)
    .delete(subjects.delete);

  // Finish by binding the subject middleware
  app.param('subjectId', subjects.subjectByID);
};
