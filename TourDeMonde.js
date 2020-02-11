let Game = require('./Game.js')
const inquirer = require('inquirer')
const async = require('async')

module.exports = class TourDeMonde extends Game {
    constructor(nbPlayers){
        super(nbPlayers, 'Le tour du Monde')
    }
    // Fonction asynchrone qui lance le jeu
    async playGame() {
        if(this.tour === 0){
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
            if(player.shot === 1){
                console.log("A toi de jouer "+player.name)
            }
            let questScore = []
            questScore.push({
                type: 'number',
                name: player.name + '-tour-' + player.shot + '_' + game.tour,
                message: player.name + ' shot ' + player.shot + ' :',
                validate: function (v){
                    if(isNaN(parseFloat(v))) { return "Saisissez un chiffre" }
                    if (v <= 0 || v >= 21) { return "Fausse valeur" }
                    return true
                }
            })
            await inquirer.prompt(questScore).then((answer) => {
                var score = Object.values(answer)
                // On vérifie si la partie est gagnée
                if(score[0] === 20 && player.max === 19){
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
            if(player.shot === 3){
                player.shot = 1
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
                player.shot++
                return this.askScore(game, player, id)
            }
        }
    }
}
