'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true
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
  },
  user_from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  user_to: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  article: {
    type: Schema.ObjectId,
    ref: 'Article'
  },
  subject: {
    type: Schema.ObjectId,
    ref: 'Subject'
  },
  comment_from: {
    type: Schema.ObjectId,
    ref: 'Subject'
  }
});

// var ObjectId = mongoose.Schema.Types.ObjectId
CommentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  } else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Comment', CommentSchema);
