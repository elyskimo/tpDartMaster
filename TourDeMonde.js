let Game = require('./Game.js');
const inquirer = require('inquirer');
const async = require('async');

module.exports = class TourDeMonde extends Game {
    constructor(nbPlayers){
        super(nbPlayers, 'Le tour du Monde')
    }
    // Fonction asynchrone qui lance le jeu
    async playGame() {
        if(this.tour === 0){
            console.log("C'est parti!");
        }
        return await this.askScore(this, this.players[0], 0);
    }
    
    // Fonction récursive qui demande le sécteur touché
    // et ensuite gere le score et le passage des joueurs
    async askScore(game, player, id) {

            if(player.shot === 1){
                console.log("\nA toi de jouer "+player.name);
                let secteur = player.max+1;
                console.log("Le secteur à toucher "+secteur);
            }
            let questScore = [];
            questScore.push({
                type: 'number',
                name: player.name + '-tour-' + player.shot + '_' + game.tour,
                message: player.name + ' shot ' + player.shot + ' :',
                validate: function (v){
                    if(isNaN(parseFloat(v))) { return "Saisissez un chiffre" }
                    if (v <= 0 || v >= 21) { return "Fausse valeur" }
                    return true
                }
            });
            await inquirer.prompt(questScore).then((answer) => {
                if(game.gameWon){
                    return Promise.reject("\n******************** JEU TERMINÉ ********************\n")
                }
                var score = Object.values(answer);
                // On vérifie si la partie est gagnée
                if(score[0] === 20 && player.max === 19){
                    game.winners.push(player);
                    player.inGame = false;
                    player.shot = 1;
                    player.max = 0;
                    player = game.getNextPlayer(id+1);
                    id = game.players.indexOf(player);
                    console.log("\nBravo, "+player.name+" a terminé le jeu!\n");
                    // On vérifie si le jeu est terminé
                    if(game.winners.length === game.players.length){
                        game.gameWon = true;
                        return Promise.reject("\n******************** JEU TERMINÉ ********************\n")
                    }
                    return this.askScore(game, player, id);
                }
                // On vérifie que le joueur a touché le bon secteur
                if(score[0] === player.max+1){
                    player.max = score[0];
                    console.log('Bien joué!');
                }
                // On traite les tirs et les tours des joueurs
                // Si le joueur a tiré 3 fois on passe a l'autre joueur
                if(player.shot === 3){
                    player.shot = 1;
                    player = game.getNextPlayer(id+1);
                    id = game.players.indexOf(player);
                    return this.askScore(game, player, id);
                }else{
                    player.shot++;
                    return this.askScore(game, player, id);
                }
            });

    }
};
