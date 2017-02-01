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
describe('Subject Admin CRUD tests', function () {
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

    // Save a user to the test db and create new subject
    user.save(function () {
      subject = {
        title: 'Subject Title',
        content: 'Subject Content'
      };

      done();
    });
  });

  it('should be able to save an subject if logged in', function (done) {
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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
            }

            // Get a list of subjects
            agent.get('/api/subjects')
              .end(function (subjectsGetErr, subjectsGetRes) {
                // Handle subject save error
                if (subjectsGetErr) {
                  return done(subjectsGetErr);
                }

                // Get subjects list
                var subjects = subjectsGetRes.body;

                // Set assertions
                (subjects[0].user._id).should.equal(userId);
                (subjects[0].title).should.match('Subject Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an subject if signed in', function (done) {
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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
            }

            // Update subject title
            subject.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing subject
            agent.put('/api/subjects/' + subjectSaveRes.body._id)
              .send(subject)
              .expect(200)
              .end(function (subjectUpdateErr, subjectUpdateRes) {
                // Handle subject update error
                if (subjectUpdateErr) {
                  return done(subjectUpdateErr);
                }

                // Set assertions
                (subjectUpdateRes.body._id).should.equal(subjectSaveRes.body._id);
                (subjectUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an subject if no title is provided', function (done) {
    // Invalidate title field
    subject.title = '';

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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(422)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Set message assertion
            (subjectSaveRes.body.message).should.match('Title cannot be blank');

            // Handle subject save error
            done(subjectSaveErr);
          });
      });
  });

  it('should be able to delete an subject if signed in', function (done) {
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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
            }

            // Delete an existing subject
            agent.delete('/api/subjects/' + subjectSaveRes.body._id)
              .send(subject)
              .expect(200)
              .end(function (subjectDeleteErr, subjectDeleteRes) {
                // Handle subject error error
                if (subjectDeleteErr) {
                  return done(subjectDeleteErr);
                }

                // Set assertions
                (subjectDeleteRes.body._id).should.equal(subjectSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single subject if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new subject model instance
    subject.user = user;
    var subjectObj = new Subject(subject);

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

        // Save a new subject
        agent.post('/api/subjects')
          .send(subject)
          .expect(200)
          .end(function (subjectSaveErr, subjectSaveRes) {
            // Handle subject save error
            if (subjectSaveErr) {
              return done(subjectSaveErr);
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

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (subjectInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
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
