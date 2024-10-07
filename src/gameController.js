export default function GameController(player1, com) {
    let activePlayer = player1;
    let nextPlayer = com;
    let tempPlayer;
    const getActivePlayer = () => activePlayer;

    player1.gameboard.placeShip(0, 0, 5, true);
    player1.gameboard.placeShip(2, 2, 4, true);
    player1.gameboard.placeShip(5, 5, 3, false);
    player1.gameboard.placeShip(6, 6, 3, true);
    player1.gameboard.placeShip(7, 3, 2, false);

    com.gameboard.placeShip(0, 0, 5, true);
    com.gameboard.placeShip(2, 2, 4, true);
    com.gameboard.placeShip(5, 5, 3, false);
    com.gameboard.placeShip(6, 6, 3, true);
    com.gameboard.placeShip(7, 3, 2, false);

    const switchPlayerTurn = () => {
        tempPlayer = activePlayer;
        activePlayer = nextPlayer;
        nextPlayer = tempPlayer;
    };

    const winCondition = () => {
        return nextPlayer.gameboard.allShipsSunk();
    };

    const playRound = (x, y) => {
        let message = `${activePlayer.name} dropped a bomb to ${nextPlayer.name}'s board...`;
        if (!activePlayer.checkAttack(nextPlayer, x, y)) {
            message = "This Coordinate has been bombed!";
        } else if (winCondition()) {
            message = `${activePlayer.name} Wins!`;
        } else {
            switchPlayerTurn();
        }
        return message;
    };

    return { getActivePlayer, winCondition, playRound };
}
