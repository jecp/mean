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
describe('Comment Admin CRUD tests', function () {
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
      roles: ['user', 'admin'],
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

  it('should be able to save an comment if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
            }

            // Get a list of comments
            agent.get('/api/comments')
              .end(function (commentsGetErr, commentsGetRes) {
                // Handle comment save error
                if (commentsGetErr) {
                  return done(commentsGetErr);
                }

                // Get comments list
                var comments = commentsGetRes.body;

                // Set assertions
                (comments[0].user._id).should.equal(userId);
                (comments[0].title).should.match('Comment Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an comment if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
            }

            // Update comment title
            comment.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing comment
            agent.put('/api/comments/' + commentSaveRes.body._id)
              .send(comment)
              .expect(200)
              .end(function (commentUpdateErr, commentUpdateRes) {
                // Handle comment update error
                if (commentUpdateErr) {
                  return done(commentUpdateErr);
                }

                // Set assertions
                (commentUpdateRes.body._id).should.equal(commentSaveRes.body._id);
                (commentUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an comment if no title is provided', function (done) {
    // Invalidate title field
    comment.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(422)
          .end(function (commentSaveErr, commentSaveRes) {
            // Set message assertion
            (commentSaveRes.body.message).should.match('Title cannot be blank');

            // Handle comment save error
            done(commentSaveErr);
          });
      });
  });

  it('should be able to delete an comment if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
            }

            // Delete an existing comment
            agent.delete('/api/comments/' + commentSaveRes.body._id)
              .send(comment)
              .expect(200)
              .end(function (commentDeleteErr, commentDeleteRes) {
                // Handle comment error error
                if (commentDeleteErr) {
                  return done(commentDeleteErr);
                }

                // Set assertions
                (commentDeleteRes.body._id).should.equal(commentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single comment if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new comment model instance
    comment.user = user;
    var commentObj = new Comment(comment);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new comment
        agent.post('/api/comments')
          .send(comment)
          .expect(200)
          .end(function (commentSaveErr, commentSaveRes) {
            // Handle comment save error
            if (commentSaveErr) {
              return done(commentSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (commentInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
