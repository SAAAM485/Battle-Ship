import "./style.css";
import Player from "./player";
import GameController from "./gameController";
import Ship from "./ship";

function ScreenController(player1, player2) {
    const game = GameController(player1, player2);
    const player1BoardDiv = document.querySelector(".p1");
    const player2BoardDiv = document.querySelector(".p2");
    const messageDiv1 = document.querySelector(".msg1");
    const messageDiv2 = document.querySelector(".msg2");
    const player1Board = player1.gameboard;
    const player2Board = player2.gameboard;

    player1BoardDiv.classList.remove("set");
    player2BoardDiv.classList.remove("set");
    player1BoardDiv.classList.add("play");
    player2BoardDiv.classList.add("play");

    function updateBoard() {
        const activePlayer = game.getActivePlayer();
        const opponent = game.getOpponent();

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

        player2BoardDiv.textContent = "";
        player2Board.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                if (activePlayer.name !== player2.name) {
                    cellButton.disabled = false;
                } else {
                    cellButton.disabled = true;
                }
                if (cell instanceof Ship) {
                    cellButton.classList.add("ship");
                }
                if (
                    player2Board.missedAttacks.some(
                        (combo) =>
                            Number(combo[0]) === rowIndex &&
                            Number(combo[1]) === columnIndex
                    )
                ) {
                    cellButton.classList.add("missed");
                } else if (
                    player2Board.hitAttacks.some(
                        (combo) =>
                            Number(combo[0]) === rowIndex &&
                            Number(combo[1]) === columnIndex
                    )
                ) {
                    cellButton.classList.add("hit");
                }
                player2BoardDiv.appendChild(cellButton);
            });
        });

        if (game.winCondition(opponent)) {
            const buttons1 = player1BoardDiv.querySelectorAll("button");
            buttons1.forEach((button) => (button.disabled = true));
            const buttons2 = player2BoardDiv.querySelectorAll("button");
            buttons2.forEach((button) => (button.disabled = true));
        } else {
            messageDiv1.textContent = `It's ${activePlayer.name}'s Turn!`;
        }

        if (
            player2.computer &&
            activePlayer === player2 &&
            !game.winCondition(opponent)
        ) {
            comAutoMoves();
        }
    }

    function comAutoMoves() {
        if (player1Board.lastHit) {
            let [x, y] =
                player1Board.hitAttacks[player1Board.hitAttacks.length - 1];
            let newPos = player2.getRandomDirection(player1, x, y);
            if (newPos) {
                [x, y] = newPos;
            } else {
                [x, y] = player2.getRandomPos(player1);
            }
            messageDiv2.textContent = game.playRound(x, y);
            updateBoard();
        } else {
            let [x, y] = player2.getRandomPos(player1);
            messageDiv2.textContent = game.playRound(x, y);
            updateBoard();
        }
        return;
    }

    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        messageDiv2.textContent = game.playRound(selectedRow, selectedColumn);
        updateBoard();
    }

    player1BoardDiv.addEventListener("click", boardClickHandler);
    player2BoardDiv.addEventListener("click", boardClickHandler);

    updateBoard();
}

function settingBoard() {
    const player1 = new Player("Player1");
    const player2 = new Player("com", true);
    const player1BoardDiv = document.querySelector(".p1");
    const player2BoardDiv = document.querySelector(".p2");
    const messageDiv1 = document.querySelector(".msg1");
    const messageDiv2 = document.querySelector(".msg2");
    const player1Board = player1.gameboard;
    const player2Board = player2.gameboard;
    const randomPlaceBtn = document.querySelector("#random");
    const startBtn = document.querySelector("#start");

    player1BoardDiv.classList.remove("play");
    player2BoardDiv.classList.remove("play");
    player1BoardDiv.classList.add("set");
    player2BoardDiv.classList.add("set");

    player1Board.placeShipRandom();
    player2Board.placeShipRandom();

    function updateSettingBoard() {
        player1BoardDiv.textContent = "";
        player1Board.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                if (cell instanceof Ship) {
                    cellButton.classList.add("ship");
                    cellButton.addEventListener("mousedown", () => {
                        if (event.button == 1) {
                            player1Board.rotateShip(rowIndex, columnIndex);
                            updateSettingBoard();
                            return;
                        }
                        player1Board.removeShip(rowIndex, columnIndex);
                        updateSettingBoard();
                    });
                } else {
                    cellButton.addEventListener("mouseup", () => {
                        const ghostShip = document.querySelector(".ghostShips");
                        if (ghostShip) {
                            const length = parseInt(ghostShip.dataset.length);
                            const isVertical =
                                ghostShip.dataset.isVertical === "true";
                            if (
                                player1Board.canPlaceShip(
                                    rowIndex,
                                    columnIndex,
                                    length,
                                    isVertical
                                )
                            ) {
                                player1Board.placeShip(
                                    rowIndex,
                                    columnIndex,
                                    length,
                                    isVertical
                                );
                                player1Board.removeGhostShip();
                                updateSettingBoard();
                            } else {
                                return;
                            }
                        }
                    });
                }

                player1BoardDiv.appendChild(cellButton);
            });
        });

        player2BoardDiv.textContent = "";
        player2Board.board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.disabled = true;
                if (cell instanceof Ship) {
                    cellButton.classList.add("ship");
                }
                player2BoardDiv.appendChild(cellButton);
            });
        });
    }
    messageDiv1.textContent = "Place Your Ships!";
    messageDiv2.textContent = "Click Middle Mouse To Rotate The Ship!";
    updateSettingBoard();
    randomPlaceBtn.addEventListener("click", () => {
        player1Board.removeAllShip();
        player1Board.placeShipRandom();
        updateSettingBoard();
    });
    startBtn.addEventListener("click", () => {
        ScreenController(player1, player2);
    });
}

settingBoard();
