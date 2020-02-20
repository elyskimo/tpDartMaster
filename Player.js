module.exports = class Player {
    constructor(name) {
        this.name = name;
        this.max = 0;
        this.shot = 1; // all the players has 3 shots
        this.tourScores = [];
        this.inGame = true;
    }
};
