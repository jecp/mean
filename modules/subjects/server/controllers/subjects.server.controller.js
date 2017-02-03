'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Subject = mongoose.model('Subject'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Forum = mongoose.model('Forum'),
  Comment = mongoose.model('Comment'),
  User = mongoose.model('User'),
  _ = require('lodash'),
  markdown = require('markdown').markdown;

/**
 * Create an subject
 */
exports.create = function (req, res) {
  var subject = new Subject(req.body);
  subject.user = req.user;
  console.log(req.user);
  subject.updated = subject.created = Date.now();
  var f = req.body.f ? '588e1f3f3a7ec54c8ac9a53a' : '588e1f3f3a7ec54c8ac9a53a';
  subject.content = req.body.content ? markdown.toHTML(req.body.content) : '';
  subject.markdown = req.body.content;

  if (f) {
    subject.forum = f;

    subject.save(function (err, subject) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(subject);
        Forum.findOneAndUpdate({ _id: f }, { $inc: { pv: 1 }, $push: { subject: subject._id } }, function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }
};

/**
 * Show the current subject
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var subject = req.subject ? req.subject.toJSON() : {};

  // Add a custom field to the Subject, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Subject model.
  subject.isCurrentUserOwner = !!(req.user && subject.user && subject.user._id.toString() === req.user._id.toString());

  res.json(subject);
};

/**
 * Update an subject
 */
exports.update = function (req, res) {
  var subject = req.subject;
  console.log(req.body.comment);
  if (req.body.comment) { // save comment from subject
    var comment = new Comment(req.body);
    comment._id = mongoose.Types.ObjectId();
    comment.content = req.body.comment;
    comment.subject = req.body._id;
    comment.user = req.body.user;
    comment.save(function (err, comment) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else { // update subject insert comment

        subject = _.extend(subject, req.body);
        subject.content = markdown.toHTML(req.body.markdown);

        Subject.findOneAndUpdate({ _id: req.subject._id }, { $inc: { pv: 1 }, $push: { comments: comment._id } }, function (err, subject) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(subject);
          }
        });
      }
    });
  } else { // update subject
    subject = _.extend(subject, req.body);
    subject.content = markdown.toHTML(req.body.markdown);

    subject.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(subject);
      }
    });
  }
};

/**
 * Delete an subject
 */
exports.delete = function (req, res) {
  var subject = req.subject;

  subject.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subject);
    }
  });
};

/**
 * List of Subjects
 */
exports.list = function (req, res) {
  Subject.find().sort('-created').populate('user', 'displayName profileImageURL').exec(function (err, subjects) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subjects);
    }
  });
};

/**
 * Count of Subjects
 */
exports.count = function(req, res) {
  Subject.count().exec(function(err, subjects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(subjects);
    }
  });
};

/**
 * count of User Subjects
 */
exports.userCount = function(req, res) {

  Subject.count({ user: req.user._id }, function (err, count) {
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
 * Like a Subject
 */
exports.like = function(req, res) {
  var subjectId = req.body._id;
  if (req.user._id) {
    User.findOne({ _id: req.user._id, subjects_like: subjectId }, function (err, user) {
      if (err) {
        console.log(err);
      } else if (user) {
        Subject.findOneAndUpdate({ _id: subjectId }, { $inc: { like: -1 } }).exec(function (err, subject) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            user.update({ $pull: { subjects_like: subjectId } }).exec(function (err, user) {
              if (err) {
                console.log(err);
              } else {
                res.send(subject);
              }
            });
          }
        });
      } else {
        Subject.findOneAndUpdate({ _id: subjectId }, { $inc: { like: 1 } }).exec(function (err, subject) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            User.findOneAndUpdate({ _id: req.user._id }, { $push: { subjects_like: subjectId } }).exec(function (err, user) {
              if (err) {
                console.log(err);
              } else {
                res.send(subject);
              }
            });
          }
        });
      }
    });
  }
};

/**
 * Subject middleware
 */
exports.subjectByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Subject is invalid'
    });
  }

  Subject.findOneAndUpdate({ _id: id }, { $inc: { pv: 1 } }).exec(function (err, subject) {
    if (err) {
      return next(err);
    }
  });

  Subject.findById(id).populate('user', 'displayName').populate('comments', 'content user.displayName user.profileImageURL created updated').exec(function (err, subject) {
    if (err) {
      return next(err);
    } else if (!subject) {
      return res.status(404).send({
        message: 'No subject with that identifier has been found'
      });
    }
    req.subject = subject;
    next();
  });
};
