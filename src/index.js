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
    const randomPlaceBtn = document.querySelector("#random");
    const startBtn = document.querySelector("#start");
    const restartBtn = document.querySelector("#restart");
    const comRadio = document.querySelector("#com");
    const p2Radio = document.querySelector("#p2Mode");

    randomPlaceBtn.disabled = true;
    startBtn.disabled = true;
    restartBtn.disabled = false;
    comRadio.disabled = true;
    p2Radio.disabled = true;

    player1BoardDiv.classList.remove("set");
    player2BoardDiv.classList.remove("set");
    player1BoardDiv.classList.add("play");
    player2BoardDiv.classList.add("play");

    function updateBoard() {
        const activePlayer = game.getActivePlayer();
        const opponent = game.getOpponent();

        if (activePlayer.name === player1.name) {
            player1BoardDiv.classList.add("active");
            player2BoardDiv.classList.remove("active");
        } else {
            player1BoardDiv.classList.remove("active");
            player2BoardDiv.classList.add("active");
        }

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

    function hideBoard() {
        const p1Btns = document.querySelector(".p1").querySelectorAll("button");
        const p2Btns = document.querySelector(".p2").querySelectorAll("button");
        p1Btns.forEach((btn) => {
            btn.classList.add("hide");
        });
        p2Btns.forEach((btn) => {
            btn.classList.add("hide");
        });
    }

    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) {
            return;
        }

        messageDiv2.textContent = game.playRound(selectedRow, selectedColumn);
        const activePlayer = game.getActivePlayer();
        updateBoard();
        if (!player2.computer) {
            if (activePlayer.name === player1.name) {
                restrictP2();
                hideBoard();
            } else if (activePlayer.name === player2.name) {
                restrictP1();
                hideBoard();
            }
            setTimeout(() => {
                updateBoard();
            }, 3000);
        } else {
            return;
        }
    }

    player1BoardDiv.addEventListener("click", boardClickHandler);
    player2BoardDiv.addEventListener("click", boardClickHandler);

    updateBoard();
}

function settingBoard() {
    const comRadio = document.querySelector("#com");
    const p2Radio = document.querySelector("#p2Mode");
    let isCom = comRadio.checked;
    const player1 = new Player("Player1");
    let player2 = new Player("com", isCom);
    const player1BoardDiv = document.querySelector(".p1");
    const player2BoardDiv = document.querySelector(".p2");
    const messageDiv1 = document.querySelector(".msg1");
    const messageDiv2 = document.querySelector(".msg2");
    const player1Board = player1.gameboard;
    let player2Board = player2.gameboard;
    const randomPlaceBtn = document.querySelector("#random");
    const startBtn = document.querySelector("#start");
    const restartBtn = document.querySelector("#restart");
    let currentPlayer = player1;

    comRadio.addEventListener("change", (e) => {
        if (e.target.checked) {
            isCom = true;
        }
        player2 = new Player("com", isCom);
        player2Board = player2.gameboard;
        player2Board.removeAllShip();
        player2Board.placeShipRandom();
        updateSettingBoard();
        restrictP2();
        resetStartButtonEvent();
    });
    p2Radio.addEventListener("change", (e) => {
        if (e.target.checked) {
            isCom = false;
        }
        player2 = new Player("Player2", isCom);
        player2Board = player2.gameboard;
        player2Board.removeAllShip();
        player2Board.placeShipRandom();
        updateSettingBoard();
        restrictP2();
        resetStartButtonEvent();
    });

    randomPlaceBtn.disabled = false;
    startBtn.disabled = false;
    restartBtn.disabled = true;
    comRadio.disabled = false;
    p2Radio.disabled = false;

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
                    cellButton.addEventListener("mousedown", (event) => {
                        if (event.button == 1) {
                            player1Board.rotateShip(rowIndex, columnIndex);
                            updateSettingBoard();
                            restrictP2();
                            return;
                        }
                        player1Board.removeShip(rowIndex, columnIndex);
                        updateSettingBoard();
                        restrictP2();
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
                                restrictP2();
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
        if (player2.computer) {
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
        } else {
            player2Board.board.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
                    cellButton.dataset.row = rowIndex;
                    cellButton.dataset.column = columnIndex;
                    if (cell instanceof Ship) {
                        cellButton.classList.add("ship");
                        cellButton.addEventListener("mousedown", (event) => {
                            if (event.button == 1) {
                                player2Board.rotateShip(rowIndex, columnIndex);
                                updateSettingBoard();
                                restrictP1();
                                return;
                            }
                            player2Board.removeShip(rowIndex, columnIndex);
                            updateSettingBoard();
                            restrictP1();
                        });
                    } else {
                        cellButton.addEventListener("mouseup", () => {
                            const ghostShip =
                                document.querySelector(".ghostShips");
                            if (ghostShip) {
                                const length = parseInt(
                                    ghostShip.dataset.length
                                );
                                const isVertical =
                                    ghostShip.dataset.isVertical === "true";
                                if (
                                    player2Board.canPlaceShip(
                                        rowIndex,
                                        columnIndex,
                                        length,
                                        isVertical
                                    )
                                ) {
                                    player2Board.placeShip(
                                        rowIndex,
                                        columnIndex,
                                        length,
                                        isVertical
                                    );
                                    player2Board.removeGhostShip();
                                    updateSettingBoard();
                                    restrictP1();
                                } else {
                                    return;
                                }
                            }
                        });
                    }
                    player2BoardDiv.appendChild(cellButton);
                });
            });
        }
    }
    function resetStartButtonEvent() {
        // Clone the start button to clear previous events
        const newStartBtn = startBtn.cloneNode(true);
        startBtn.replaceWith(newStartBtn);
        // Attach the new event listener
        newStartBtn.addEventListener("click", () => {
            if (
                !player2.computer &&
                !document.querySelector(".p1").querySelector("button").disabled
            ) {
                switchSettingBoard();
                return;
            }
            ScreenController(player1, player2);
        });
    }

    function switchSettingBoard() {
        const p1Btns = document.querySelector(".p1").querySelectorAll("button");
        const p2Btns = document.querySelector(".p2").querySelectorAll("button");
        p1Btns.forEach((btn) => {
            btn.disabled = true;
        });
        p2Btns.forEach((btn) => {
            btn.disabled = false;
        });
        comRadio.disabled = true;
        p2Radio.disabled = true;
        currentPlayer = player2;
        messageDiv1.textContent =
            "Place Player2's Ships! Press Start To Continue!";
    }

    messageDiv1.textContent = "Place Player1's Ships! Press Start To Continue!";
    messageDiv2.textContent = "Click Middle Mouse To Rotate The Ship!";
    updateSettingBoard();
    restrictP2();

    randomPlaceBtn.addEventListener("click", () => {
        currentPlayer.gameboard.removeAllShip();
        currentPlayer.gameboard.placeShipRandom();
        updateSettingBoard();
        currentPlayer == player1 ? restrictP2() : restrictP1();
    });
    resetStartButtonEvent(player1, player2);
    restartBtn.addEventListener("click", () => {
        player1Board.ships = [];
        player1Board.missedAttacks = [];
        player1Board.hitAttacks = [];
        player2Board.ships = [];
        player2Board.missedAttacks = [];
        player2Board.hitAttacks = [];
        settingBoard();
    });
}

function restrictP1() {
    const p1Btns = document.querySelector(".p1").querySelectorAll("button");
    p1Btns.forEach((btn) => {
        btn.disabled = true;
    });
}

function restrictP2() {
    const p2Btns = document.querySelector(".p2").querySelectorAll("button");
    p2Btns.forEach((btn) => {
        btn.disabled = true;
    });
}

settingBoard();
