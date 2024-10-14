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
            return;
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
            this.createGhostShip(shipLength, ship.isVertical);
        }
    }

    rotateShip(x, y) {
        if (!this.board[x][y]) {
            return;
        } else {
            const ship = this.board[x][y];
            const shipLength = ship.length;
            const newDir = !ship.isVertical;
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
            if (this.canPlaceShip(a, b, shipLength, newDir)) {
                this.placeShip(a, b, shipLength, newDir);
            } else {
                if (!newDir) {
                    for (let i = 0; i < ship.length; i++) {
                        this.board[a + i][b] = ship;
                    }
                } else {
                    for (let i = 0; i < ship.length; i++) {
                        this.board[a][b + i] = ship;
                    }
                }
            }
        }
    }

    createGhostShip(length, isVertical) {
        const createContainer = document.createElement("div");
        if (isVertical) {
            createContainer.style.gridTemplateRows = `repeat(${length}, 2.5rem)`;
        } else {
            createContainer.style.gridTemplateColumns = `repeat(${length}, 2.5rem)`;
        }
        createContainer.classList.add("ghostShips");
        createContainer.dataset.length = length;
        createContainer.dataset.isVertical = isVertical;

        for (let i = 0; i < length; i++) {
            const ghostShip = document.createElement("div");
            ghostShip.classList.add("ghost");
            createContainer.appendChild(ghostShip);
        }
        const moveCursor = (event) => {
            const y = event.pageY;
            const x = event.pageX;
            const scrollLeft =
                window.scrollX !== undefined
                    ? window.scrollX
                    : (
                          document.documentElement ||
                          document.body.parentNode ||
                          document.body
                      ).scrollLeft;
            const scrollTop =
                window.scrollY !== undefined
                    ? window.scrollY
                    : (
                          document.documentElement ||
                          document.body.parentNode ||
                          document.body
                      ).scrollTop;
            createContainer.style.left = x - scrollLeft + "px";
            createContainer.style.top = y - scrollTop + "px";
        };
        document.body.appendChild(createContainer);
        document.addEventListener("mousemove", moveCursor);
    }

    removeGhostShip() {
        const ghostShip = document.querySelector(".ghostShips");
        ghostShip.remove();
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
