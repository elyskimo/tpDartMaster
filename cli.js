const inquirer = require('inquirer');
const async = require('async');
require('events').EventEmitter.prototype._maxListeners = 200;

const Game = require('./Game.js');
const TourDeMonde = require('./engine/gamemodes/around-the-world');
const Le301 = require('./engine/gamemodes/301');
const Player = require('./Player');

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}
var game = new Game();
// On demande le mode de jeu et le nombre de joueurs
let promise = game.askGameParams();
promise.then(() => {
    if(game.mode === 'Le tour du Monde'){
        game = new TourDeMonde(game.nbPlayers)
    }
    if(game.mode === 'Le 301'){
        game = new Le301(game.nbPlayers)
    }
    return game.askNames(game.nbPlayers)
}).catch((err) => {
    console.log(err)
}).then(() => {

    // on mélange l'array pour obtenir un ordre alétoire
    shuffleArray(game.players);
    
    // On lance le jeu
    return game.playGame()
}).catch((err) => {
    console.error(err);
}).
then(() => {
    console.table(game.winners, ["name"])
});
