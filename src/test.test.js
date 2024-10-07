import Ship from "./ship";
import Gameboard from "./gameboard";
import Player from "./player";

describe("Ship tests", () => {
    const ship = new Ship(5);
    test("Ship parameters", () => {
        expect(ship.length).toBe(5);
        expect(ship.beenHit).toBe(0);
        expect(ship.sunk).toBe(false);
    });
    test("Ship.hit()", () => {
        ship.hit();
        expect(ship.beenHit).toBe(1);
    });
    test("Ship.isSunk()", () => {
        expect(ship.sunk).toBe(false);
    });
    test("Ship.isSunk()", () => {
        for (let i = 0; i < 4; i++) {
            ship.hit();
        }
        expect(ship.sunk).toBe(true);
    });
});

describe("Gameboard tests", () => {
    const gameboard = new Gameboard();
    test("Gameboard places ships correctly", () => {
        gameboard.placeShip(0, 0, 3, true);
        expect(gameboard.board[0][0]).toBeInstanceOf(Ship);
        expect(gameboard.board[1][0]).toBeInstanceOf(Ship);
        expect(gameboard.board[2][0]).toBeInstanceOf(Ship);
    });

    test("Gameboard handles attacks correctly", () => {
        gameboard.receiveAttack(0, 0);
        expect(gameboard.board[0][0].beenHit).toBe(1);
        gameboard.receiveAttack(1, 0);
        gameboard.receiveAttack(2, 0);
        expect(gameboard.board[0][0].isSunk()).toBe(true);
        expect(gameboard.allShipsSunk()).toBe(true);
    });

    test("Gameboard records missed attacks", () => {
        gameboard.receiveAttack(5, 5);
        expect(gameboard.missedAttacks).toContainEqual([5, 5]);
    });
});

describe("Player tests", () => {
    const player1 = new Player();
    const player2 = new Player();
    test("Player can attack opponent", () => {
        player2.gameboard.placeShip(0, 0, 3, false);
        player1.attack(player2, 0, 2);
        expect(player2.gameboard.board[0][1].beenHit).toBe(1);
    });
    const computerPlayer = new Player(true);
    test("Computer player can attack opponent", () => {
        player1.gameboard.placeShip(0, 0, 3, true);
        computerPlayer.attack(player1, 0, 0);
        expect(player1.gameboard.board[2][0].beenHit).toBe(1);
    });
});
