const Game = require('../classes/Game.js');
const inquirer = require('inquirer');
const async = require('async');

module.exports = class Le301 extends Game {
    constructor(nbPlayers){
        super(nbPlayers, 'Le 301');
    }

    // Fonction asynchrone qui lance le jeu
    async playGame(){
        // On set le score de tous les joueurs à 301
        for (var player of this.players){
            player.max = 301;
        }
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
            console.log("Ton score: "+player.max);
        }
        let questScore = [];
        questScore.push({
            type: 'number',
            name: player.name + '-tour-' + player.shot + '_' + game.tour,
            message: player.name + ' shot ' + player.shot + ' :',
            validate: function (v){
                if(isNaN(parseFloat(v))) { return "Saisissez un chiffre" }
                if (v < 0 || v >= 61) { return "Fausse valeur" }
                return true
            }
        });
        await inquirer.prompt(questScore).then((answer) => {

            // On stocke le score dans un array
            var score = Object.values(answer);
            player.tourScores.push(score[0]);

            // On vérifie que le score ne dépasse pas 0
            // Si le score dépasse 0 ou est égale a 1 => le tour n'est pas pris en compte
            if(player.max - player.tourScores.reduce((a,b) => {return a + b}, 0) < 0
            || player.max - player.tourScores.reduce((a,b) => {return a + b}, 0) === 1)
            {
                player.shot = 1;
                player.tourScores = [];
                console.log("Ton score tiré n'est pas pris en compte");
                player = game.getNextPlayer(id+1);
                id = game.players.indexOf(player);
                return this.askScore(game, player, id);
            }

            // Si le joueur términe par 0, on vérifie si c'était un double
            let sumScore = player.tourScores.reduce((a,b) => {return a + b}, 0);
            if(player.max - sumScore === 0){
              if(player.shot === 1){
                player.shot = 1;
                player.tourScores = [];
                player = game.getNextPlayer(id+1);
                id = game.players.indexOf(player);
                console.log("Ton score tiré n'est pas pris en compte car tu dois terminer avec un double");
                return this.askScore(game, player, id)
              }
              if(player.shot === 2 && player.tourScores[0] === player.tourScores[1]){
                player.shot = 1;
                player.tourScores = [];
                player.inGame = false;
                game.winners.push(player);
                console.log("\nBravo, "+player.name+" a terminé le jeu!\n");

                // On vérifie si le jeu est terminé
                if(game.winners.length === game.players.length){
                  game.gameOver = true;
                  return Promise.reject("\n******************** JEU TERMINÉ ********************\n")
                }
                player = game.getNextPlayer(id+1);
                id = game.players.indexOf(player);
                return this.askScore(game, player, id)
              }
            }
        });

        // On traite les tirs et les tours des joueurs
        // Si le joueur a tiré 3 fois on calcule son score et on passe à l'autre joueur
        if(player.shot === 3 && !game.gameOver){

            // On vérifie si le joueur a gagné (vérifier si les derniers deux tirs sont les doubles)
            // On vérifie que son score tiré ne dépasse pas 0
            let sumScore = player.tourScores.reduce((a,b) => {return a + b}, 0);
            // Si le score égale a zéro
            if(player.max - sumScore === 0){
                // On vérifie si les derniers deux tirs ont été doubles
                if(player.tourScores[1] === player.tourScores[2]){
                    // On soustrait le score tiré et on met le joueur dans l'array des gagnants
                    player.max -= sumScore;
                    game.winners.push(player);
                    player.inGame = false;
                    player.tourScores = [];
                    player.shot = 1;
                    console.log("\nBravo, "+player.name+" a terminé le jeu!\n");

                    // On vérifie si le jeu est terminé
                    if(game.winners.length === game.players.length){
                      game.gameOver = true;
                      return Promise.reject("\n******************** JEU TERMINÉ ********************\n")
                    }

                    // On passe a un autre joueur
                    player = this.getNextPlayer(id+1);
                    id = game.players.indexOf(player);
                    return this.askScore(game, player, id)

                }else{
                  // On prend pas en compte ce tour
                  console.log("Vous devez términer avec un double")
                }
            }else if (player.max - sumScore < 0 || player.max - sumScore === 1) {

              // On prend pas en compte ce tour
              console.log("Ton score tiré n'est pas pris en compte")
            }else{
                // On soustrait le score
                player.max -= sumScore
            }

            player.shot = 1;
            player.tourScores = [];
            player = this.getNextPlayer(id+1);
            id = game.players.indexOf(player);
            return this.askScore(game, player, id)

        }
        else{
            player.shot++;
            return this.askScore(game, player, id)
        }
    }
};
