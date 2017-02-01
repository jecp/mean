'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  Subject = mongoose.model('Subject'),
  Article = mongoose.model('Article'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  User = mongoose.model('User'),
  _ = require('lodash'),
  markdown = require('markdown').markdown;

/**
 * Create an comment
 */
exports.create = function (req, res) {
  console.log(req.body);
  var comment = new Comment(req.body);
  var obj = req.body.obj;
  comment.user = req.user;
  comment.content = req.body.content ? markdown.toHTML(req.body.content) : '';
  comment.markdown = req.body.content;

  if (obj === 'articles') {
    comment.articles = req.body.value;
    comment.save(function (err, comment) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send(comment);
      }
    });
  } else if (obj === 'subjects') {
    comment.subjects = req.body.value;
    comment.save(function (err, comment) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.send(comment);
        Subject.findOneAndUpdate({ _id: req.body.value }, { $inc: { pv: 1 }, $push: { comment: comment._id } }, function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  } else {
    comment.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(comment);
      }
    });
  }
};

/**
 * Show the current comment
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var comment = req.comment ? req.comment.toJSON() : {};

  // Add a custom field to the Comment, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Comment model.
  comment.isCurrentUserOwner = !!(req.user && comment.user && comment.user._id.toString() === req.user._id.toString());

  res.json(comment);
};

/**
 * Update an comment
 */
exports.update = function (req, res) {
  var comment = req.comment;

  comment.title = req.body.title;
  comment.content = req.body.content;

  comment.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * Delete an comment
 */
exports.delete = function (req, res) {
  var comment = req.comment;

  comment.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * List of Comments
 */
exports.list = function (req, res) {
  var obj = req.query.obj;
  console.log(req.body);
  if (obj === 'articles') {
    Comment.find({ articles: req.query.value }).sort('created').populate('user', 'username avatar created').exec(function (err, comments) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(comments);
      }
    });
  } else if (obj === 'subjects') {
    Comment.find({ subjects: req.query.value }).sort('created').populate('user', 'username avatar created').exec(function (err, comments) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(comments);
      }
    });
  } else {
    Comment.find().sort('created').populate('user', 'displayname').populate('subjects', 'title').populate('articles', 'title').exec(function (err, comments) {
      if (err) {
        console.log(err);
      }
      res.json(comments);
    });
  }
};

/**
 * Count of Comments
 */
exports.count = function(req, res) {
  Comment.count().exec(function (err, comments) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(comments);
    }
  });
};

/**
 *  count of User comments
 */
exports.userCount = function (req, res) {
  Comment.count({ user: req.user._id }, function (err, count) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(count);
    }
  });
};

/**
 * Modify a Comment
 */
exports.modify = function(req, res) {
  var commentObj = req.body;
  Comment.findOneAndUpdate({ _id: commentObj._id }, { subcat: commentObj.subcat, name: commentObj.name, title: commentObj.title, price: commentObj.price }, function (err, comment) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(comment);
    }
  });
};

/**
 * Comment middleware
 */
exports.commentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Comment is invalid'
    });
  }

  Comment.findById(id).populate('user', 'displayName').exec(function (err, comment) {
    if (err) {
      return next(err);
    } else if (!comment) {
      return res.status(404).send({
        message: 'No comment with that identifier has been found'
      });
    }
    req.comment = comment;
    next();
  });
};
