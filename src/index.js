import "./style.css";
import Player from "./player";
import GameController from "./gameController";

function ScreenController() {
    const player1 = new Player();
    const com = new Player(true);
    const game = GameController(player1, com);

    function updateBoard() {
        const player1BoardDiv = document.querySelector(".p1");
        const comBoardDiv = document.querySelector(".p2");
        const player1Board = player1.gameboard;
        const comBoard = com.gameboard;
        const activePlayer = game.getActivePlayer();
        player1Board.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                player1BoardDiv.appendChild(cellButton);
            });
        });
    }
}

ScreenController();
