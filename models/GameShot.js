const mongoose = require('mongoose');
const Player = require('./Player');
const Game = require('./Game');

const gameShotSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    validate: (id) => {
      return new Promise(function(resolve, reject) {
          // let Player = mongoose.model('Player');  //you would have to be sure that Category model is loaded before this one.  One reason not to do this
          Player.findOne({_id: id}, (err, id) => resolve(id ? true : false));  //any non null value means the category was in the categories collection
      });
    }
  },
  gameId: {
    type: String,
    required: true,
    validate: (id) => {
      return new Promise(function(resolve, reject) {
          // let Player = mongoose.model('Player');  //you would have to be sure that Category model is loaded before this one.  One reason not to do this
          Game.findOne({_id: id}, (err, id) => resolve(id ? true : false));  //any non null value means the category was in the categories collection
      });
    }
  },
  multiplicator: {
    type: Number,
    enum: [1,2,3],
    required: true
  },
  sector: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
}, { collection: 'gameShots' });

module.exports = mongoose.model('GameShot',gameShotSchema);
