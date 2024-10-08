import Ship from "./ship";

export default class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.missedAttacks = [];
        this.hitAttacks = [];
        this.ships = [];
        this.lastHit = false;
    }

    placeShip(x, y, length, isVertical = true) {
        const ship = new Ship(length);
        if (isVertical) {
            if (x + length > 9) {
                throw new Error("Out of the board");
            }
            for (let i = 0; i < length; i++) {
                if (this.board[x + i][y] !== null) {
                    throw new Error("Position already occupied");
                }
            }
            for (let i = 0; i < length; i++) {
                this.board[x + i][y] = ship;
            }
        } else {
            if (y + length > 9) {
                throw new Error("Out of the board");
            }

            for (let i = 0; i < length; i++) {
                if (this.board[x][y + i] !== null) {
                    throw new Error("Position already occupied");
                }
            }
            for (let i = 0; i < length; i++) {
                this.board[x][y + i] = ship;
            }
        }
        this.ships.push(ship);
    }

    receiveAttack(x, y) {
        if (this.board[x][y]) {
            this.board[x][y].hit();
            this.hitAttacks.push([x, y]);
            this.lastHit = true;
        } else {
            this.missedAttacks.push([x, y]);
            this.lastHit = false;
        }
    }

    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
