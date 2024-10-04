export default function GameController(player1, com) {
    let activePlayer = player1;
    let nextPlayer = com;
    let tempPlayer;
    const getActivePlayer = () => activePlayer;

    player1.gameboard.placeShips(0, 0, 5, true);
    player1.gameboard.placeShips(2, 2, 4, true);
    player1.gameboard.placeShips(5, 3, 3, false);
    player1.gameboard.placeShips(6, 6, 3, true);
    player1.gameboard.placeShips(4, 3, 2, false);

    com.gameboard.placeShips(0, 0, 5, true);
    com.gameboard.placeShips(2, 2, 4, true);
    com.gameboard.placeShips(5, 3, 3, false);
    com.gameboard.placeShips(6, 6, 3, true);
    com.gameboard.placeShips(4, 3, 2, false);

    const switchPlayerTurn = () => {
        tempPlayer = activePlayer;
        activePlayer = nextPlayer;
        nextPlayer = tempPlayer;
    };

    const winCondition = () => {
        return nextPlayer.gameboard.allShipsSunk();
    };

    return { getActivePlayer, switchPlayerTurn, winCondition };
}
