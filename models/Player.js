const mongoose = require('mongoose');
import { isEmail } from 'validator';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 255
  },
  email: {
    type: String,
    required: true,
    validate: [ isEmail, 'invalid email' ]
  },
  gameWin: {
    type: Number,
    required: true
  },
  gameLost: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
}, { collection: 'players' });

module.exports = mongoose.model('Player',playerSchema);
