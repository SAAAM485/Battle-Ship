import Gameboard from "./gameboard";

export default class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.gameboard = new Gameboard();
        this.computer = isComputer;
    }

    attack(opponent, x, y) {
        return opponent.gameboard.receiveAttack(x, y);
    }

    checkAttack(opponent, x, y) {
        if (
            opponent.gameboard.hitAttacks.some(
                (combo) => combo[0] === x && combo[1] === y
            ) ||
            opponent.gameboard.missedAttacks.some(
                (combo) => combo[0] === x && combo[1] === y
            )
        ) {
            return false;
        } else {
            this.attack(opponent, x, y);
            return true;
        }
    }
}
