'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Like = mongoose.model('Like'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  like;

/**
 * Like routes tests
 */
describe('Like Admin CRUD tests', function () {
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

    // Save a user to the test db and create new like
    user.save(function () {
      like = {
        title: 'Like Title',
        content: 'Like Content'
      };

      done();
    });
  });

  it('should be able to save an like if logged in', function (done) {
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

        // Save a new like
        agent.post('/api/likes')
          .send(like)
          .expect(200)
          .end(function (likeSaveErr, likeSaveRes) {
            // Handle like save error
            if (likeSaveErr) {
              return done(likeSaveErr);
            }

            // Get a list of likes
            agent.get('/api/likes')
              .end(function (likesGetErr, likesGetRes) {
                // Handle like save error
                if (likesGetErr) {
                  return done(likesGetErr);
                }

                // Get likes list
                var likes = likesGetRes.body;

                // Set assertions
                (likes[0].user._id).should.equal(userId);
                (likes[0].title).should.match('Like Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an like if signed in', function (done) {
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

        // Save a new like
        agent.post('/api/likes')
          .send(like)
          .expect(200)
          .end(function (likeSaveErr, likeSaveRes) {
            // Handle like save error
            if (likeSaveErr) {
              return done(likeSaveErr);
            }

            // Update like title
            like.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing like
            agent.put('/api/likes/' + likeSaveRes.body._id)
              .send(like)
              .expect(200)
              .end(function (likeUpdateErr, likeUpdateRes) {
                // Handle like update error
                if (likeUpdateErr) {
                  return done(likeUpdateErr);
                }

                // Set assertions
                (likeUpdateRes.body._id).should.equal(likeSaveRes.body._id);
                (likeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an like if no title is provided', function (done) {
    // Invalidate title field
    like.title = '';

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

        // Save a new like
        agent.post('/api/likes')
          .send(like)
          .expect(422)
          .end(function (likeSaveErr, likeSaveRes) {
            // Set message assertion
            (likeSaveRes.body.message).should.match('Title cannot be blank');

            // Handle like save error
            done(likeSaveErr);
          });
      });
  });

  it('should be able to delete an like if signed in', function (done) {
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

        // Save a new like
        agent.post('/api/likes')
          .send(like)
          .expect(200)
          .end(function (likeSaveErr, likeSaveRes) {
            // Handle like save error
            if (likeSaveErr) {
              return done(likeSaveErr);
            }

            // Delete an existing like
            agent.delete('/api/likes/' + likeSaveRes.body._id)
              .send(like)
              .expect(200)
              .end(function (likeDeleteErr, likeDeleteRes) {
                // Handle like error error
                if (likeDeleteErr) {
                  return done(likeDeleteErr);
                }

                // Set assertions
                (likeDeleteRes.body._id).should.equal(likeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single like if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new like model instance
    like.user = user;
    var likeObj = new Like(like);

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

        // Save a new like
        agent.post('/api/likes')
          .send(like)
          .expect(200)
          .end(function (likeSaveErr, likeSaveRes) {
            // Handle like save error
            if (likeSaveErr) {
              return done(likeSaveErr);
            }

            // Get the like
            agent.get('/api/likes/' + likeSaveRes.body._id)
              .expect(200)
              .end(function (likeInfoErr, likeInfoRes) {
                // Handle like error
                if (likeInfoErr) {
                  return done(likeInfoErr);
                }

                // Set assertions
                (likeInfoRes.body._id).should.equal(likeSaveRes.body._id);
                (likeInfoRes.body.title).should.equal(like.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (likeInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Like.remove().exec(done);
    });
  });
});
