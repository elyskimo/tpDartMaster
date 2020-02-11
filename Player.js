module.exports = class Player {
    constructor(name) {
        this.name = name
        this.max = 0
        this.shot = 1
        this.tourScores = []
        this.inGame = true
    }
}
