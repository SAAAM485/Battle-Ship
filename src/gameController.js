export default function GameController(player1, com) {
    let activePlayer = player1;
    let nextPlayer = com;
    let tempPlayer;
    const getActivePlayer = () => activePlayer;
    const getOpponent = () => nextPlayer;

    const switchPlayerTurn = () => {
        tempPlayer = activePlayer;
        activePlayer = nextPlayer;
        nextPlayer = tempPlayer;
    };

    const winCondition = (opponent) => {
        return opponent.gameboard.allShipsSunk();
    };

    const playRound = (x, y) => {
        let message = `${activePlayer.name} dropped a bomb to ${nextPlayer.name}'s board...`;
        if (!activePlayer.checkAttack(nextPlayer, x, y)) {
            message = "This Coordinate has been bombed!";
            return message;
        } else {
            activePlayer.attack(nextPlayer, x, y);
        }
        if (winCondition(nextPlayer)) {
            message = `${activePlayer.name} Wins!`;
        } else {
            switchPlayerTurn();
        }
        return message;
    };

    return { getActivePlayer, getOpponent, winCondition, playRound };
}
