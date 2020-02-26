const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ["around-the-world", "301", "cricket"],
    required: true
  },
  name: {
    type: String,
    required: true,
    max: 255
  },
  currentPlayerId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["draft", "started", "ended"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
}, { collection: 'games' });

module.exports = mongoose.model('Game',gameSchema);
