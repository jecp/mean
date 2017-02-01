'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Forum = mongoose.model('Forum'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  forum;

/**
 * Forum routes tests
 */
describe('Forum Admin CRUD tests', function () {
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

    // Save a user to the test db and create new forum
    user.save(function () {
      forum = {
        title: 'Forum Title',
        content: 'Forum Content'
      };

      done();
    });
  });

  it('should be able to save an forum if logged in', function (done) {
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

        // Save a new forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Get a list of forums
            agent.get('/api/forums')
              .end(function (forumsGetErr, forumsGetRes) {
                // Handle forum save error
                if (forumsGetErr) {
                  return done(forumsGetErr);
                }

                // Get forums list
                var forums = forumsGetRes.body;

                // Set assertions
                (forums[0].user._id).should.equal(userId);
                (forums[0].title).should.match('Forum Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an forum if signed in', function (done) {
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

        // Save a new forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Update forum title
            forum.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing forum
            agent.put('/api/forums/' + forumSaveRes.body._id)
              .send(forum)
              .expect(200)
              .end(function (forumUpdateErr, forumUpdateRes) {
                // Handle forum update error
                if (forumUpdateErr) {
                  return done(forumUpdateErr);
                }

                // Set assertions
                (forumUpdateRes.body._id).should.equal(forumSaveRes.body._id);
                (forumUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an forum if no title is provided', function (done) {
    // Invalidate title field
    forum.title = '';

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

        // Save a new forum
        agent.post('/api/forums')
          .send(forum)
          .expect(422)
          .end(function (forumSaveErr, forumSaveRes) {
            // Set message assertion
            (forumSaveRes.body.message).should.match('Title cannot be blank');

            // Handle forum save error
            done(forumSaveErr);
          });
      });
  });

  it('should be able to delete an forum if signed in', function (done) {
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

        // Save a new forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Delete an existing forum
            agent.delete('/api/forums/' + forumSaveRes.body._id)
              .send(forum)
              .expect(200)
              .end(function (forumDeleteErr, forumDeleteRes) {
                // Handle forum error error
                if (forumDeleteErr) {
                  return done(forumDeleteErr);
                }

                // Set assertions
                (forumDeleteRes.body._id).should.equal(forumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single forum if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new forum model instance
    forum.user = user;
    var forumObj = new Forum(forum);

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

        // Save a new forum
        agent.post('/api/forums')
          .send(forum)
          .expect(200)
          .end(function (forumSaveErr, forumSaveRes) {
            // Handle forum save error
            if (forumSaveErr) {
              return done(forumSaveErr);
            }

            // Get the forum
            agent.get('/api/forums/' + forumSaveRes.body._id)
              .expect(200)
              .end(function (forumInfoErr, forumInfoRes) {
                // Handle forum error
                if (forumInfoErr) {
                  return done(forumInfoErr);
                }

                // Set assertions
                (forumInfoRes.body._id).should.equal(forumSaveRes.body._id);
                (forumInfoRes.body.title).should.equal(forum.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (forumInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Forum.remove().exec(done);
    });
  });
});
