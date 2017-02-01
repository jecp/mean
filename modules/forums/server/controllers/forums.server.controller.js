'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Forum = mongoose.model('Forum'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an forum
 */
exports.create = function (req, res) {
  var forum = new Forum(req.body);
  forum.user = req.user;

  forum.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forum);
    }
  });
};

/**
 * Show the current forum
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var forum = req.forum ? req.forum.toJSON() : {};

  // Add a custom field to the Forum, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Forum model.
  forum.isCurrentUserOwner = !!(req.user && forum.user && forum.user._id.toString() === req.user._id.toString());

  res.json(forum);
};

/**
 * Update an forum
 */
exports.update = function (req, res) {
  var forum = req.forum;

  forum.title = req.body.title;
  forum.content = req.body.content;

  forum.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forum);
    }
  });
};

/**
 * Delete an forum
 */
exports.delete = function (req, res) {
  var forum = req.forum;

  forum.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forum);
    }
  });
};

/**
 * List of Forums
 */
exports.list = function (req, res) {
  Forum.find().sort('-created').populate('user', 'displayName').exec(function (err, forums) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(forums);
    }
  });
};

/**
 * Forum middleware
 */
exports.forumByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Forum is invalid'
    });
  }

  Forum.findById(id).populate('user', 'displayName').exec(function (err, forum) {
    if (err) {
      return next(err);
    } else if (!forum) {
      return res.status(404).send({
        message: 'No forum with that identifier has been found'
      });
    }
    req.forum = forum;
    next();
  });
};
