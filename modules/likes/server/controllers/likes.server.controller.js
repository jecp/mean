'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Like = mongoose.model('Like'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  Subject = mongoose.model('Subject'),
  Article = mongoose.model('Article'),
  User = mongoose.model('User'),
  _ = require('lodash');

/**
 * Create an like
 */
exports.create = function (req, res) {

  var obj = req.body.obj,
    value = req.body.value,
    userId = req.user._id;

  if (obj === 'subjects') {
    Like.findOne({ user: userId, subjects: value }, function (err, like) {
      if (err) {
        console.log(err);
      } else if (like) {
        Like.findOneAndUpdate({ _id: like._id }, { $pull: { subjects: value } }, function (err) {
          if (err) {
            console.log(err);
          }
        });
        Subject.findOneAndUpdate({ _id: value }, { $inc: { like: -1 } }, function (err, subject) {
          if (err) {
            console.log(err);
          }
          return res.send(subject);
        });
      } else {
        Like.findOne({ user: userId }, function (err, like) {
          if (err) {
            console.log(err);
          } else if (like) {
            Like.findOneAndUpdate({ _id: like._id }, { $push: { subjects: value } }, function (err) {
              if (err) {
                console.log(err);
              }
            });
            Subject.findOneAndUpdate({ _id: value }, { $inc: { like: 1 } }, function (err, subject) {
              if (err) {
                console.log(err);
              }
              return res.send(subject);
            });
          } else {
            var _like = new Like(req.body);
            _like.user = req.user;
            _like.subjects = value;
            _like.save(function (err, like) {
              if (err) {
                console.log(err);
              } else {
                User.findOneAndUpdate({ _id: userId }, { like: like._id }, function (err, user) {
                  if (err) {
                    console.log(err);
                  }
                });
                Subject.findOneAndUpdate({ _id: value }, { $inc: { like: 1 } }, function (err, subject) {
                  if (err) {
                    console.log(err);
                  }
                  return res.send(subject);
                });
              }
            });
          }
        });
      }
    });
  } else {
    Like.findOne({ user: userId, articles: value }, function (err, like) {
      if (err) {
        console.log(err);
      } else if (like) {
        Like.findOneAndUpdate({ _id: like._id }, { $pull: { articles: value } }, function (err) {
          if (err) {
            console.log(err);
          }
        });
        Article.findOneAndUpdate({ _id: value }, { $inc: { like: -1 } }, function (err, article) {
          if (err) {
            console.log(err);
          }
          return res.send(article);
        });
      } else {
        Like.findOne({ user: userId }, function (err, like) {
          if (err) {
            console.log(err);
          } else if (like) {
            Like.findOneAndUpdate({ _id: like._id }, { $push: { articles: value } }, function (err) {
              if (err) {
                console.log(err);
              }
            });
            Article.findOneAndUpdate({ _id: value }, { $inc: { like: 1 } }, function (err, article) {
              if (err) {
                console.log(err);
              }
              return res.send(article);
            });
          } else {
            var _like = new Like(req.body);
            _like.user = req.user;
            _like.articles = value;
            _like.save(function (err, like) {
              if (err) {
                console.log(err);
              }
              User.findOneAndUpdate({ _id: userId }, { like: like._id }, function (err) {
                if (err) {
                  console.log(err);
                }
              });
              Article.findOneAndUpdate({ _id: value }, { $inc: { like: 1 } }, function (err, article) {
                if (err) {
                  console.log(err);
                }
                return res.send(article);
              });
            });
          }
        });
      }
    });
  }
};

/**
 * Show the current like
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var like = req.like ? req.like.toJSON() : {};

  // Add a custom field to the Like, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Like model.
  like.isCurrentUserOwner = !!(req.user && like.user && like.user._id.toString() === req.user._id.toString());

  res.json(like);
};

/**
 * Update an like
 */
exports.update = function (req, res) {
  var like = req.like;

  like.title = req.body.title;
  like.content = req.body.content;

  like.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(like);
    }
  });
};

/**
 * Delete an like
 */
exports.delete = function (req, res) {
  var like = req.like;

  like.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(like);
    }
  });
};

/**
 * List of Likes
 */
exports.list = function (req, res) {
  Like.find().sort('-created').populate('user', 'displayName').exec(function (err, likes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(likes);
    }
  });
};

/**
 * Like middleware
 */
exports.likeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Like is invalid'
    });
  }

  Like.findById(id).populate('user', 'displayName').exec(function (err, like) {
    if (err) {
      return next(err);
    } else if (!like) {
      return res.status(404).send({
        message: 'No like with that identifier has been found'
      });
    }
    req.like = like;
    next();
  });
};
