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
            return true;
        }
    }

    getRandomPos(opponent) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        if (!this.checkAttack(opponent, x, y)) {
            return this.getRandomPos(opponent);
        } else {
            return [x, y];
        }
    }
    getRandomDirection(opponent, x, y) {
        const directions = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
        ];

        const validDirections = directions.filter((combo) => {
            const [newX, newY] = combo;
            const isValid =
                newX >= 0 &&
                newX <= 9 &&
                newY >= 0 &&
                newY <= 9 &&
                this.checkAttack(opponent, newX, newY);
            console.log(`Checking direction (${newX}, ${newY}): ${isValid}`);
            return isValid && !(newX === x && newY === y);
        });

        console.log("Valid Directions:", validDirections);
        if (validDirections.length === 0) {
            return false;
        }

        const randomIndex = Math.floor(Math.random() * validDirections.length);
        const newPos = validDirections[randomIndex];

        return newPos;
    }
}
