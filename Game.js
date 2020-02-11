const inquirer = require('inquirer')
const async = require('async')
const Player = require('./Player')

module.exports = class Game {
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

    // Fonction récursive qui retourne le joueur suivant
    getNextPlayer(id){
      if(id > this.players.length-1 || this.players[id] === null)
      {
        this.tour++
        this.showScoreTable()
        return this.getNextPlayer(0)
      }
      if(!this.players[id].inGame){
        return this.getNextPlayer(id+1)
      }
      if(this.players.length === this.winners.length){
        this.gameWon = true
        return null
      }

      return this.players[id]
    }

    // Fonction qui demande le mode de jeu et le nombre de joueurs
    async askGameParams() {
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
    // Fonction qui affiche le tableaux contenant les noms des joueurs et leur score maximal
    showScoreTable(){
        console.log("********* "+this.mode+" - tour "+this.tour+" *********")
        console.table(this.players, ["name","max"])
    }
}
