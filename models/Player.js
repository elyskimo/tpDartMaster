const mongoose = require('mongoose');
const validator = require('validator');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255
  },
  email: {
    type: String,
    required: true,
    validate: (v) => {validator.isEmail(v)}
  },
  gameWin: {
    type: Number,
    required: true,
    default: 0
  },
  gameLost: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
}, { collection: 'players' });

module.exports = mongoose.model('Player',playerSchema);
