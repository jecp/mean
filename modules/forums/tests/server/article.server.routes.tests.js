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
describe('Forum CRUD tests', function () {

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

    // Save a user to the test db and create new forum
    user.save(function () {
      forum = {
        title: 'Forum Title',
        content: 'Forum Content'
      };

      done();
    });
  });

  it('should not be able to save an forum if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/forums')
          .send(forum)
          .expect(403)
          .end(function (forumSaveErr, forumSaveRes) {
            // Call the assertion callback
            done(forumSaveErr);
          });

      });
  });

  it('should not be able to save an forum if not logged in', function (done) {
    agent.post('/api/forums')
      .send(forum)
      .expect(403)
      .end(function (forumSaveErr, forumSaveRes) {
        // Call the assertion callback
        done(forumSaveErr);
      });
  });

  it('should not be able to update an forum if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/forums')
          .send(forum)
          .expect(403)
          .end(function (forumSaveErr, forumSaveRes) {
            // Call the assertion callback
            done(forumSaveErr);
          });
      });
  });

  it('should be able to get a list of forums if not signed in', function (done) {
    // Create new forum model instance
    var forumObj = new Forum(forum);

    // Save the forum
    forumObj.save(function () {
      // Request forums
      request(app).get('/api/forums')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single forum if not signed in', function (done) {
    // Create new forum model instance
    var forumObj = new Forum(forum);

    // Save the forum
    forumObj.save(function () {
      request(app).get('/api/forums/' + forumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', forum.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single forum with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/forums/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Forum is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single forum which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent forum
    request(app).get('/api/forums/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No forum with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an forum if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/forums')
          .send(forum)
          .expect(403)
          .end(function (forumSaveErr, forumSaveRes) {
            // Call the assertion callback
            done(forumSaveErr);
          });
      });
  });

  it('should not be able to delete an forum if not signed in', function (done) {
    // Set forum user
    forum.user = user;

    // Create new forum model instance
    var forumObj = new Forum(forum);

    // Save the forum
    forumObj.save(function () {
      // Try deleting forum
      request(app).delete('/api/forums/' + forumObj._id)
        .expect(403)
        .end(function (forumDeleteErr, forumDeleteRes) {
          // Set message assertion
          (forumDeleteRes.body.message).should.match('User is not authorized');

          // Handle forum error error
          done(forumDeleteErr);
        });

    });
  });

  it('should be able to get a single forum that has an orphaned user reference', function (done) {
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

          // Save a new forum
          agent.post('/api/forums')
            .send(forum)
            .expect(200)
            .end(function (forumSaveErr, forumSaveRes) {
              // Handle forum save error
              if (forumSaveErr) {
                return done(forumSaveErr);
              }

              // Set assertions on new forum
              (forumSaveRes.body.title).should.equal(forum.title);
              should.exist(forumSaveRes.body.user);
              should.equal(forumSaveRes.body.user._id, orphanId);

              // force the forum to have an orphaned user reference
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
                        should.equal(forumInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single forum if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new forum model instance
    var forumObj = new Forum(forum);

    // Save the forum
    forumObj.save(function () {
      request(app).get('/api/forums/' + forumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', forum.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single forum, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'forumowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Forum
    var _forumOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _forumOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Forum
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

          // Save a new forum
          agent.post('/api/forums')
            .send(forum)
            .expect(200)
            .end(function (forumSaveErr, forumSaveRes) {
              // Handle forum save error
              if (forumSaveErr) {
                return done(forumSaveErr);
              }

              // Set assertions on new forum
              (forumSaveRes.body.title).should.equal(forum.title);
              should.exist(forumSaveRes.body.user);
              should.equal(forumSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (forumInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Forum.remove().exec(done);
    });
  });
});
