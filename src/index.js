import "./style.css";
import Player from "./player";
import GameController from "./gameController";
import Ship from "./ship";

function ScreenController() {
    const player1 = new Player("Player1");
    const com = new Player("com", true);
    const game = GameController(player1, com);
    const player1BoardDiv = document.querySelector(".p1");
    const comBoardDiv = document.querySelector(".p2");
    const messageDiv = document.querySelector(".msg");
    const player1Board = player1.gameboard;
    const comBoard = com.gameboard;

    function updateBoard() {
        const activePlayer = game.getActivePlayer();

        messageDiv.textContent = `It's ${activePlayer.name}'s Turn!`;
        player1BoardDiv.textContent = "";
        player1Board.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                if (activePlayer.name !== player1.name) {
                    cellButton.disabled = false;
                } else {
                    cellButton.disabled = true;
                }
                if (cell instanceof Ship) {
                    cellButton.classList.add("ship");
                }
                if (
                    player1Board.missedAttacks.some(
                        (combo) =>
                            Number(combo[0]) === rowIndex &&
                            Number(combo[1]) === columnIndex
                    )
                ) {
                    cellButton.classList.add("missed");
                } else if (
                    player1Board.hitAttacks.some(
                        (combo) =>
                            Number(combo[0]) === rowIndex &&
                            Number(combo[1]) === columnIndex
                    )
                ) {
                    cellButton.classList.add("hit");
                }
                player1BoardDiv.appendChild(cellButton);
            });
        });

        comBoardDiv.textContent = "";
        comBoard.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                if (activePlayer.name !== com.name) {
                    cellButton.disabled = false;
                } else {
                    cellButton.disabled = true;
                }
                if (cell instanceof Ship) {
                    cellButton.classList.add("ship");
                }
                if (
                    comBoard.missedAttacks.some(
                        (combo) =>
                            Number(combo[0]) === rowIndex &&
                            Number(combo[1]) === columnIndex
                    )
                ) {
                    cellButton.classList.add("missed");
                } else if (
                    comBoard.hitAttacks.some(
                        (combo) =>
                            Number(combo[0]) === rowIndex &&
                            Number(combo[1]) === columnIndex
                    )
                ) {
                    cellButton.classList.add("hit");
                }
                comBoardDiv.appendChild(cellButton);
            });
        });
    }

    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        messageDiv.textContent = game.playRound(selectedRow, selectedColumn);
        updateBoard();
    }

    player1BoardDiv.addEventListener("click", boardClickHandler);
    comBoardDiv.addEventListener("click", boardClickHandler);

    updateBoard();
}

ScreenController();
