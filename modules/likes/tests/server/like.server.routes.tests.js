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
describe('Like CRUD tests', function () {

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

    // Save a user to the test db and create new like
    user.save(function () {
      like = {
        title: 'Like Title',
        content: 'Like Content'
      };

      done();
    });
  });

  it('should not be able to save an like if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/likes')
          .send(like)
          .expect(403)
          .end(function (likeSaveErr, likeSaveRes) {
            // Call the assertion callback
            done(likeSaveErr);
          });

      });
  });

  it('should not be able to save an like if not logged in', function (done) {
    agent.post('/api/likes')
      .send(like)
      .expect(403)
      .end(function (likeSaveErr, likeSaveRes) {
        // Call the assertion callback
        done(likeSaveErr);
      });
  });

  it('should not be able to update an like if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/likes')
          .send(like)
          .expect(403)
          .end(function (likeSaveErr, likeSaveRes) {
            // Call the assertion callback
            done(likeSaveErr);
          });
      });
  });

  it('should be able to get a list of likes if not signed in', function (done) {
    // Create new like model instance
    var likeObj = new Like(like);

    // Save the like
    likeObj.save(function () {
      // Request likes
      request(app).get('/api/likes')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single like if not signed in', function (done) {
    // Create new like model instance
    var likeObj = new Like(like);

    // Save the like
    likeObj.save(function () {
      request(app).get('/api/likes/' + likeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', like.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single like with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/likes/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Like is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single like which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent like
    request(app).get('/api/likes/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No like with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an like if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/likes')
          .send(like)
          .expect(403)
          .end(function (likeSaveErr, likeSaveRes) {
            // Call the assertion callback
            done(likeSaveErr);
          });
      });
  });

  it('should not be able to delete an like if not signed in', function (done) {
    // Set like user
    like.user = user;

    // Create new like model instance
    var likeObj = new Like(like);

    // Save the like
    likeObj.save(function () {
      // Try deleting like
      request(app).delete('/api/likes/' + likeObj._id)
        .expect(403)
        .end(function (likeDeleteErr, likeDeleteRes) {
          // Set message assertion
          (likeDeleteRes.body.message).should.match('User is not authorized');

          // Handle like error error
          done(likeDeleteErr);
        });

    });
  });

  it('should be able to get a single like that has an orphaned user reference', function (done) {
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

          // Save a new like
          agent.post('/api/likes')
            .send(like)
            .expect(200)
            .end(function (likeSaveErr, likeSaveRes) {
              // Handle like save error
              if (likeSaveErr) {
                return done(likeSaveErr);
              }

              // Set assertions on new like
              (likeSaveRes.body.title).should.equal(like.title);
              should.exist(likeSaveRes.body.user);
              should.equal(likeSaveRes.body.user._id, orphanId);

              // force the like to have an orphaned user reference
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
                        should.equal(likeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single like if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new like model instance
    var likeObj = new Like(like);

    // Save the like
    likeObj.save(function () {
      request(app).get('/api/likes/' + likeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', like.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single like, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'likeowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Like
    var _likeOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _likeOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Like
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

          // Save a new like
          agent.post('/api/likes')
            .send(like)
            .expect(200)
            .end(function (likeSaveErr, likeSaveRes) {
              // Handle like save error
              if (likeSaveErr) {
                return done(likeSaveErr);
              }

              // Set assertions on new like
              (likeSaveRes.body.title).should.equal(like.title);
              should.exist(likeSaveRes.body.user);
              should.equal(likeSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (likeInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Like.remove().exec(done);
    });
  });
});
