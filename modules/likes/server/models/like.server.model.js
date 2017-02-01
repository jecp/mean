'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Like Schema
 */
var LikeSchema = new Schema({
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
  pv: {
    type: Number,
    default: 0
  },
  subjects: [{
    type: Schema.ObjectId,
    ref: 'Subject'
  }],
  articles: [{
    type: Schema.ObjectId,
    ref: 'Article'
  }],
  collect: {
    type: Number,
    default: 0
  }
});

// var ObjectId = mongoose.Schema.Types.ObjectId
LikeSchema.pre('save', function(next) {
  if (this.isNew) {
    this.create = this.update = Date.now;
  } else {
    this.update = Date.now;
  }

  next();
});

mongoose.model('Like', LikeSchema);
