'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Comment = mongoose.model('Comment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  comment;

/**
 * Comment routes tests
 */
describe('Comment CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new comment
    user.save(function () {
      comment = {
        title: 'Comment Title',
        content: 'Comment Content'
      };

      done();
    });
  });

  it('should not be able to save an comment if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/comments')
          .send(comment)
          .expect(403)
          .end(function (commentSaveErr, commentSaveRes) {
            // Call the assertion callback
            done(commentSaveErr);
          });

      });
  });

  it('should not be able to save an comment if not logged in', function (done) {
    agent.post('/api/comments')
      .send(comment)
      .expect(403)
      .end(function (commentSaveErr, commentSaveRes) {
        // Call the assertion callback
        done(commentSaveErr);
      });
  });

  it('should not be able to update an comment if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/comments')
          .send(comment)
          .expect(403)
          .end(function (commentSaveErr, commentSaveRes) {
            // Call the assertion callback
            done(commentSaveErr);
          });
      });
  });

  it('should be able to get a list of comments if not signed in', function (done) {
    // Create new comment model instance
    var commentObj = new Comment(comment);

    // Save the comment
    commentObj.save(function () {
      // Request comments
      request(app).get('/api/comments')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single comment if not signed in', function (done) {
    // Create new comment model instance
    var commentObj = new Comment(comment);

    // Save the comment
    commentObj.save(function () {
      request(app).get('/api/comments/' + commentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', comment.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single comment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/comments/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Comment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single comment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent comment
    request(app).get('/api/comments/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No comment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an comment if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/comments')
          .send(comment)
          .expect(403)
          .end(function (commentSaveErr, commentSaveRes) {
            // Call the assertion callback
            done(commentSaveErr);
          });
      });
  });

  it('should not be able to delete an comment if not signed in', function (done) {
    // Set comment user
    comment.user = user;

    // Create new comment model instance
    var commentObj = new Comment(comment);

    // Save the comment
    commentObj.save(function () {
      // Try deleting comment
      request(app).delete('/api/comments/' + commentObj._id)
        .expect(403)
        .end(function (commentDeleteErr, commentDeleteRes) {
          // Set message assertion
          (commentDeleteRes.body.message).should.match('User is not authorized');

          // Handle comment error error
          done(commentDeleteErr);
        });

    });
  });

  it('should be able to get a single comment that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new comment
          agent.post('/api/comments')
            .send(comment)
            .expect(200)
            .end(function (commentSaveErr, commentSaveRes) {
              // Handle comment save error
              if (commentSaveErr) {
                return done(commentSaveErr);
              }

              // Set assertions on new comment
              (commentSaveRes.body.title).should.equal(comment.title);
              should.exist(commentSaveRes.body.user);
              should.equal(commentSaveRes.body.user._id, orphanId);

              // force the comment to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the comment
                    agent.get('/api/comments/' + commentSaveRes.body._id)
                      .expect(200)
                      .end(function (commentInfoErr, commentInfoRes) {
                        // Handle comment error
                        if (commentInfoErr) {
                          return done(commentInfoErr);
                        }

                        // Set assertions
                        (commentInfoRes.body._id).should.equal(commentSaveRes.body._id);
                        (commentInfoRes.body.title).should.equal(comment.title);
                        should.equal(commentInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single comment if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new comment model instance
    var commentObj = new Comment(comment);

    // Save the comment
    commentObj.save(function () {
      request(app).get('/api/comments/' + commentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', comment.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single comment, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'commentowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Comment
    var _commentOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _commentOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Comment
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new comment
          agent.post('/api/comments')
            .send(comment)
            .expect(200)
            .end(function (commentSaveErr, commentSaveRes) {
              // Handle comment save error
              if (commentSaveErr) {
                return done(commentSaveErr);
              }

              // Set assertions on new comment
              (commentSaveRes.body.title).should.equal(comment.title);
              should.exist(commentSaveRes.body.user);
              should.equal(commentSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the comment
                  agent.get('/api/comments/' + commentSaveRes.body._id)
                    .expect(200)
                    .end(function (commentInfoErr, commentInfoRes) {
                      // Handle comment error
                      if (commentInfoErr) {
                        return done(commentInfoErr);
                      }

                      // Set assertions
                      (commentInfoRes.body._id).should.equal(commentSaveRes.body._id);
                      (commentInfoRes.body.title).should.equal(comment.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (commentInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Comment.remove().exec(done);
    });
  });
});
