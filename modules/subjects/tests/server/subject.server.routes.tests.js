'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Subject = mongoose.model('Subject'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  subject;

/**
 * Subject routes tests
 */
describe('Subject CRUD tests', function () {

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

    // Save a user to the test db and create new subject
    user.save(function () {
      subject = {
        title: 'Subject Title',
        content: 'Subject Content'
      };

      done();
    });
  });

  it('should not be able to save an subject if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/subjects')
          .send(subject)
          .expect(403)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Call the assertion callback
            done(subjectSaveErr);
          });

      });
  });

  it('should not be able to save an subject if not logged in', function (done) {
    agent.post('/api/subjects')
      .send(subject)
      .expect(403)
      .end(function (subjectSaveErr, subjectSaveRes) {
        // Call the assertion callback
        done(subjectSaveErr);
      });
  });

  it('should not be able to update an subject if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/subjects')
          .send(subject)
          .expect(403)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Call the assertion callback
            done(subjectSaveErr);
          });
      });
  });

  it('should be able to get a list of subjects if not signed in', function (done) {
    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      // Request subjects
      request(app).get('/api/subjects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single subject if not signed in', function (done) {
    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      request(app).get('/api/subjects/' + subjectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', subject.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single subject with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/subjects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Subject is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single subject which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent subject
    request(app).get('/api/subjects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No subject with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an subject if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/subjects')
          .send(subject)
          .expect(403)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Call the assertion callback
            done(subjectSaveErr);
          });
      });
  });

  it('should not be able to delete an subject if not signed in', function (done) {
    // Set subject user
    subject.user = user;

    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      // Try deleting subject
      request(app).delete('/api/subjects/' + subjectObj._id)
        .expect(403)
        .end(function (subjectDeleteErr, subjectDeleteRes) {
          // Set message assertion
          (subjectDeleteRes.body.message).should.match('User is not authorized');

          // Handle subject error error
          done(subjectDeleteErr);
        });

    });
  });

  it('should be able to get a single subject that has an orphaned user reference', function (done) {
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

          // Save a new subject
          agent.post('/api/subjects')
            .send(subject)
            .expect(200)
            .end(function (subjectSaveErr, subjectSaveRes) {
              // Handle subject save error
              if (subjectSaveErr) {
                return done(subjectSaveErr);
              }

              // Set assertions on new subject
              (subjectSaveRes.body.title).should.equal(subject.title);
              should.exist(subjectSaveRes.body.user);
              should.equal(subjectSaveRes.body.user._id, orphanId);

              // force the subject to have an orphaned user reference
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

                    // Get the subject
                    agent.get('/api/subjects/' + subjectSaveRes.body._id)
                      .expect(200)
                      .end(function (subjectInfoErr, subjectInfoRes) {
                        // Handle subject error
                        if (subjectInfoErr) {
                          return done(subjectInfoErr);
                        }

                        // Set assertions
                        (subjectInfoRes.body._id).should.equal(subjectSaveRes.body._id);
                        (subjectInfoRes.body.title).should.equal(subject.title);
                        should.equal(subjectInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single subject if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new subject model instance
    var subjectObj = new Subject(subject);

    // Save the subject
    subjectObj.save(function () {
      request(app).get('/api/subjects/' + subjectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', subject.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single subject, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'subjectowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Subject
    var _subjectOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _subjectOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Subject
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

          // Save a new subject
          agent.post('/api/subjects')
            .send(subject)
            .expect(200)
            .end(function (subjectSaveErr, subjectSaveRes) {
              // Handle subject save error
              if (subjectSaveErr) {
                return done(subjectSaveErr);
              }

              // Set assertions on new subject
              (subjectSaveRes.body.title).should.equal(subject.title);
              should.exist(subjectSaveRes.body.user);
              should.equal(subjectSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the subject
                  agent.get('/api/subjects/' + subjectSaveRes.body._id)
                    .expect(200)
                    .end(function (subjectInfoErr, subjectInfoRes) {
                      // Handle subject error
                      if (subjectInfoErr) {
                        return done(subjectInfoErr);
                      }

                      // Set assertions
                      (subjectInfoRes.body._id).should.equal(subjectSaveRes.body._id);
                      (subjectInfoRes.body.title).should.equal(subject.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (subjectInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Subject.remove().exec(done);
    });
  });
});
