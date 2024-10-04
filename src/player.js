import Gameboard from "./gameboard";

export default class Player {
    constructor(isComputer = false) {
        this.gameboard = new Gameboard();
        this.computer = isComputer;
    }

    attack(opponent, x, y) {
        return opponent.gameboard.receiveAttack(x, y);
    }

    switchTurn(opponent, x, y) {
        if (
            opponent.gameboard.hitAttacks.includes(
                (combo) => combo[0] === x && combo[1] === y
            ) ||
            opponent.gameboard.missedAttacks.includes(
                (combo) => combo[0] === x && combo[1] === y
            )
        ) {
            throw new Error("Already hit this coordinate before");
        } else {
            this.attack(opponent, x, y);
        }
    }
}
