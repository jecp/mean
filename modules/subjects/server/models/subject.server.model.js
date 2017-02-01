'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Subject Schema
 */
var SubjectSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  // add
  updated: {
    type: Date,
    default: Date.now
  },
  markdown: {
    type: String
  },
  subcat: {
    type: String
  },
  tags: [{
    type: String
  }],
  forum: {
    type: Schema.ObjectId,
    ref: 'Forum'
  },
  comments: [{
    type: Schema.ObjectId,
    ref: 'Comment'
  }],
  pv: {
    type: Number,
    default: 0
  },
  like: {
    type: Number,
    default: 0
  },
  collect: {
    type: Number,
    default: 0
  }
});

// var ObjectId = mongoose.Schema.Types.ObjectId
SubjectSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  } else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Subject', SubjectSchema);
