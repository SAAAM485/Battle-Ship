import Ship from "./ship";

export default class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => Array(10).fill(null));
        this.missedAttacks = [];
        this.hitAttacks = [];
        this.ships = [];
        this.lastHit = false;
    }

    placeShipRandom() {
        const shipLengths = [5, 4, 3, 3, 2];

        shipLengths.forEach((length) => {
            let placed = false;
            while (!placed) {
                const isVertical = Math.random() < 0.5;
                const x = Math.floor(
                    Math.random() * (isVertical ? 10 - length : 10)
                );
                const y = Math.floor(
                    Math.random() * (isVertical ? 10 : 10 - length)
                );

                if (this.canPlaceShip(x, y, length, isVertical)) {
                    this.placeShip(x, y, length, isVertical);
                    placed = true;
                }
            }
        });
    }

    canPlaceShip(x, y, length, isVertical = true) {
        if (isVertical) {
            if (x + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[x + i][y] !== null) return false;
            }
        } else {
            if (y + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (this.board[x][y + i] !== null) return false;
            }
        }
        return true;
    }

    placeShip(x, y, length, isVertical = true) {
        if (!this.canPlaceShip(x, y, length, isVertical)) {
            return;
        }

        const ship = new Ship(length, isVertical);
        if (isVertical) {
            for (let i = 0; i < length; i++) {
                this.board[x + i][y] = ship;
            }
            ship.coord.push(x);
            ship.coord.push(y);
        } else {
            for (let i = 0; i < length; i++) {
                this.board[x][y + i] = ship;
            }
            ship.coord.push(x);
            ship.coord.push(y);
        }
        this.ships.push(ship);
    }

    removeAllShip() {
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                if (this.board[x][y] !== null) {
                    this.board[x][y] = null; // Remove the ship reference
                }
            }
        }
        this.ships = [];
    }

    removeShip(x, y) {
        if (!this.board[x][y]) {
            console.log("didn't remove ship");
            return false;
        } else {
            const ship = this.board[x][y];
            const shipLength = ship.length;
            const shipIndex = this.ships.findIndex(
                (theShip) =>
                    theShip.coord[0] === ship.coord[0] &&
                    theShip.coord[1] === ship.coord[1]
            );
            const a = ship.coord[0];
            const b = ship.coord[1];
            if (ship.isVertical) {
                for (let i = 0; i < ship.length; i++) {
                    this.board[a + i][b] = null;
                }
            } else {
                for (let i = 0; i < ship.length; i++) {
                    this.board[a][b + i] = null;
                }
            }
            this.ships.splice(shipIndex, 1);
            return shipLength;
        }
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
