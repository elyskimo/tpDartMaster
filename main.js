const inquirer = require('inquirer')
const async = require('async')
require('events').EventEmitter.prototype._maxListeners = 200

class Game {
    constructor(nbPlayers, mode) {
        this.nbPlayers = nbPlayers
        this.mode = mode
        this.players = [] // array contenant les instances des joueurs
        this.playerId = 0 // joueur courant
        this.tour = 0 // +1 quand tous les joueurs ont tiré 3 fois
        this.gameWon = false // true si le jeu est gagné
        this.winner = "" // contiendra le nom du joueur vainqueur
        this.winners = []
    }

    // Fonction qui demande le mode de jeu et le nombre de joueurs
    async askGameParams() {
      return await inquirer.prompt(questions).then(answers => {
        this.mode = answers['mode']
        this.nbPlayers = answers['nbPlayers']
      })
    }

    // Fonction qui demande les noms des joueurs
    async askNames(nbPlayers){
      var names = []
      for (var i = 1; i <= nbPlayers; i++) {
          names.push({
              type: 'input',
              name: 'nomJoueur' + i,
              message: 'Nom joueur ' + i + ':',
          })
      }
      return await inquirer.prompt(names).then(answers => {
        var nameList = Object.values(answers)
        for (var name of nameList){
          var player = new Player(name)
          this.players.push(player)
        }
      })
    }

}

class TourDeMonde extends Game {
  constructor(nbPlayers){
    super(nbPlayers, 'Le tour du Monde')
  }

  // Fonction asynchrone qui lance le jeu
  async playGame() {
      if(this.tour == 0){
        console.log("C'est parti!")
      }
      await this.askScore(this, this.players[this.playerId], this.playerId)

      return inquirer.prompt(questScore).catch((err) => {
        console.error(err);
      }).then(answers => {
        var scores = Object.values(answers)
      })
  }

  // Fonction récursive qui demande le sécteur touché
  // et ensuite gere le score et le passage des joueurs
  async askScore(game, player, id) {
    if(!game.gameWon){
      if(player.tir === 1){
        console.log("A toi de jouer "+player.name)
      }
      let questScore = []
      questScore.push({
        type: 'number',
        name: player.name + '-tour-' + player.tir + '_' + game.tour,
        message: player.name + ' tir ' + player.tir + ' :',
        validate: function (v){
          if (v <= 0 || v >= 21) { return "Fausse valeur" }
          return true
        }
      })
      await inquirer.prompt(questScore).then((answer) => {
        var score = Object.values(answer)

        // On vérifie si la partie est gagnée
        if(score[0] === 5 && player.max === 4){
          game.gameWon = true
          game.winner = player.name
        }

        // On traite le score joué
        if(score[0] === player.max+1){
          player.max = score[0]
          if(!game.gameWon){
            console.log('Bien joué!')
          }else {
            return Promise.reject("\n=====================> "+game.winner+" a gagné le jeu! <=====================\n")
          }
        }
      })

      // On traite les tirs et les tours des joueurs
      // Si le joueur a tiré 3 fois on passe a l'autre joueur
      if(player.tir === 3){
        player.tir = 1
        if(game.playerId === game.nbPlayers-1){
          game.playerId = 0
          game.tour++
          game.showScoreTable()
          return this.askScore(game, game.players[game.playerId], game.playerId)
        }
        else{
          game.playerId = game.playerId+1
          return this.askScore(game, game.players[id+1], game.playerId)
        }
      }
      else{
        player.tir++
        return this.askScore(game, player, id)
      }

    }
  }

  // Fonction qui affiche le tableaux contenant les noms des joueurs et leur score maximal
  showScoreTable(){
    console.log("********* "+this.mode+" - tour "+this.tour+" *********")
    console.table(game.players, ["name","max"])
  }

}

class Le301 extends Game {

}

class Cricket extends Game {

}

class Player {
    constructor(name) {
        this.name = name
        this.max = 0
        this.tir = 1
    }

}
var questions = [{
    type: 'list',
    name: 'mode',
    message: "Quel mode de jeu?",
    choices: ['Le tour du Monde','Le 301','Le Cricket'],
    },
    {
    type: 'number',
    name: 'nbPlayers',
    message: "Combien de joueurs?",
    validate: function (v){
      if(isNaN(parseFloat(v))) { return "Saisissez un chiffre" }
      if (v <= 1) { return "Pour jouer saissez au moins 2 joueurs" }
      if (v >= 10) { return "Max 10 joueurs peuvent jouer" }
      return true
    },
    filter: Number,
    }]

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

var game = new Game()
// On demande le mode de jeu et le nombre de joueurs
let promise = game.askGameParams()
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
  shuffleArray(game.players)
  // On lance le jeu
  return game.playGame()
}).catch((err) => {
  console.error(err);
}).
then(() => {
  console.table(game.players, ["name","max"])
})
