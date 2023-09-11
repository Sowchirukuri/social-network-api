const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const moment = require('moment'); // Use a date library like moment.js

const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => moment(timestamp).format('MMMM Do, YYYY [at] hh:mm:ss a'),
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [ReactionSchema],
});

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
