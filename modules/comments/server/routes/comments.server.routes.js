'use strict';

/**
 * Module dependencies
 */
var commentsPolicy = require('../policies/comments.server.policy'),
  comments = require('../controllers/comments.server.controller');

module.exports = function (app) {
  // Comments collection routes
  app.route('/api/comments').all(commentsPolicy.isAllowed)
    .get(comments.list)
    .post(comments.create);

  // Single comment routes
  app.route('/api/comments/:commentId').all(commentsPolicy.isAllowed)
    .get(comments.read)
    .put(comments.update)
    .delete(comments.delete);

  // Finish by binding the comment middleware
  app.param('commentId', comments.commentByID);
};
