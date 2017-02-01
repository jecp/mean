'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Forum Schema
 */
var ForumSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Forum name',
    trim: true
  },
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
  subcat: {
    type: String
  },
  tags: [{
    type: String
  }],
  subject: [{
    type: Schema.ObjectId,
    ref: 'Subject'
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
ForumSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  } else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Forum', ForumSchema);
