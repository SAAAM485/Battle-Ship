/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameController.js":
/*!*******************************!*\
  !*** ./src/gameController.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ GameController)
/* harmony export */ });
function GameController(player1, com) {
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
  const winCondition = opponent => {
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
  return {
    getActivePlayer,
    getOpponent,
    winCondition,
    playRound
  };
}

/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Gameboard)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");

class Gameboard {
  constructor() {
    this.board = Array.from({
      length: 10
    }, () => Array(10).fill(null));
    this.missedAttacks = [];
    this.hitAttacks = [];
    this.ships = [];
    this.lastHit = false;
  }
  placeShipRandom() {
    const shipLengths = [5, 4, 3, 3, 2];
    shipLengths.forEach(length => {
      let placed = false;
      while (!placed) {
        const isVertical = Math.random() < 0.5;
        const x = Math.floor(Math.random() * (isVertical ? 10 - length : 10));
        const y = Math.floor(Math.random() * (isVertical ? 10 : 10 - length));
        if (this.canPlaceShip(x, y, length, isVertical)) {
          this.placeShip(x, y, length, isVertical);
          placed = true;
        }
      }
    });
  }
  canPlaceShip(x, y, length) {
    let isVertical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
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
  placeShip(x, y, length) {
    let isVertical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    if (!this.canPlaceShip(x, y, length, isVertical)) {
      return;
    }
    const ship = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](length, isVertical);
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
      const shipIndex = this.ships.findIndex(theShip => theShip.coord[0] === ship.coord[0] && theShip.coord[1] === ship.coord[1]);
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
    const moveCursor = event => {
      const y = event.pageY;
      const x = event.pageX;
      const scrollLeft = window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
      const scrollTop = window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
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
    return this.ships.every(ship => ship.isSunk());
  }
}

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");

class Player {
  constructor(name) {
    let isComputer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    this.name = name;
    this.gameboard = new _gameboard__WEBPACK_IMPORTED_MODULE_0__["default"]();
    this.computer = isComputer;
  }
  attack(opponent, x, y) {
    return opponent.gameboard.receiveAttack(x, y);
  }
  checkAttack(opponent, x, y) {
    if (opponent.gameboard.hitAttacks.some(combo => combo[0] === x && combo[1] === y) || opponent.gameboard.missedAttacks.some(combo => combo[0] === x && combo[1] === y)) {
      return false;
    } else {
      return true;
    }
  }
  getRandomPos(opponent) {
    let x = Math.floor(Math.random() * 10);
    let y = Math.floor(Math.random() * 10);
    if (!this.checkAttack(opponent, x, y)) {
      return this.getRandomPos(opponent);
    } else {
      return [x, y];
    }
  }
  getRandomDirection(opponent, x, y) {
    const directions = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    const validDirections = directions.filter(combo => {
      const [newX, newY] = combo;
      const isValid = newX >= 0 && newX <= 9 && newY >= 0 && newY <= 9 && this.checkAttack(opponent, newX, newY);
      return isValid && !(newX === x && newY === y);
    });
    if (validDirections.length === 0) {
      return false;
    }
    const randomIndex = Math.floor(Math.random() * validDirections.length);
    const newPos = validDirections[randomIndex];
    return newPos;
  }
}

/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
  constructor(length, isVertical) {
    this.length = length;
    this.beenHit = 0;
    this.sunk = false;
    this.coord = [];
    this.isVertical = isVertical;
  }
  hit() {
    if (this.beenHit < this.length) {
      this.beenHit++;
    }
    this.isSunk();
  }
  isSunk() {
    if (this.beenHit === this.length) {
      this.sunk = true;
      return true;
    } else {
      return false;
    }
  }
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ./media/bagel.png */ "./src/media/bagel.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
    margin: 0;
    border: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        "Open Sans",
        "Helvetica Neue",
        sans-serif;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 7s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

button:active {
    background-color: #e2dad6;
    border: 0.1rem solid #6482ad;
    color: #6482ad;
    transform: translateY(0.02rem);
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ee7652d8;
    height: 10vh;
}

button {
    border: #1f2937 0.1rem solid;
    border-radius: 2rem;
    background-color: rgb(247, 252, 255);
    color: black;
    align-self: center;
}

button:hover {
    background-color: transparent;
}

.mainContainer {
    flex-grow: 1;
    margin: 0 3rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
    background-size: 14vh;
    background-repeat: repeat;
}

.mainContainer div {
    font-size: 2rem;
    font-weight: 500;
    background-color: #e2dad6b6;
    padding: 2rem;
    border-radius: 5rem;
    margin-bottom: 1rem;
}

.boards {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}

.p1,
.p2 {
    display: grid;
    grid-template-columns: repeat(10, 2.5rem);
    grid-template-rows: repeat(10, 2.5rem);
}

.mainContainer div.active {
    background-color: #e73c7e;
}

.p1 button,
.p2 button {
    height: 2.43rem;
    width: 2.43rem;
    border: none;
    border-radius: 0;
}

.ship {
    background-color: #1f2937e5;
}

.missed {
    background-color: #e2dad6c7;
}

.missed::after {
    content: "X";
}

.hit {
    color: #fafafa;
    background-color: #e99e87;
}

.hit::after {
    content: "O";
}

.set button:disabled {
    background-color: #e2dad6c7;
}

.play button:not(:disabled) {
    background-color: #e2dad6c7;
}

.hide {
    background-color: #e2dad6c7;
}

.ghostShips {
    display: grid;
    background-color: #e2dad6b6;
    position: fixed;
    pointer-events: none;
}

.ghost {
    background-color: #1f2937;
    height: 2.43rem;
    width: 2.43rem;
}

.btns {
    width: 40vw;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0;
}

.btns button {
    height: 2.5rem;
    width: 8rem;
    font-size: 1rem;
}

fieldset {
    border: none;
    width: 40vw;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0;
}

legend {
    font-size: 1.4rem;
    text-align: center;
    margin-bottom: 1rem;
}

.mainContainer fieldset div {
    width: 10vw;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    padding: 0;
}

label {
    font-size: 1.2rem;
    display: block;
    width: 8rem;
    text-align: center;
    padding: 1rem 2rem;
    border-radius: 5rem;
}

input {
    appearance: none;
    height: 0;
    width: 0;
    margin: 0;
}

fieldset div:has(input:checked) {
    background-color: #ee7752;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"AAAA;IACI,SAAS;IACT,SAAS;IACT,YAAY;IACZ,aAAa;IACb,aAAa;IACb,sBAAsB;IACtB;;;;;;;;;;;kBAWc;IACd,uEAAuE;IACvE,0BAA0B;IAC1B,oCAAoC;AACxC;;AAEA;IACI;QACI,2BAA2B;IAC/B;IACA;QACI,6BAA6B;IACjC;IACA;QACI,2BAA2B;IAC/B;AACJ;;AAEA;IACI,yBAAyB;IACzB,4BAA4B;IAC5B,cAAc;IACd,8BAA8B;AAClC;;AAEA;IACI,aAAa;IACb,uBAAuB;IACvB,mBAAmB;IACnB,2BAA2B;IAC3B,YAAY;AAChB;;AAEA;IACI,4BAA4B;IAC5B,mBAAmB;IACnB,oCAAoC;IACpC,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,6BAA6B;AACjC;;AAEA;IACI,YAAY;IACZ,cAAc;IACd,aAAa;IACb,sBAAsB;IACtB,uBAAuB;IACvB,mBAAmB;IACnB,yDAA0C;IAC1C,qBAAqB;IACrB,yBAAyB;AAC7B;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,2BAA2B;IAC3B,aAAa;IACb,mBAAmB;IACnB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,aAAa;IACb,6BAA6B;AACjC;;AAEA;;IAEI,aAAa;IACb,yCAAyC;IACzC,sCAAsC;AAC1C;;AAEA;IACI,yBAAyB;AAC7B;;AAEA;;IAEI,eAAe;IACf,cAAc;IACd,YAAY;IACZ,gBAAgB;AACpB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,cAAc;IACd,yBAAyB;AAC7B;;AAEA;IACI,YAAY;AAChB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,2BAA2B;IAC3B,eAAe;IACf,oBAAoB;AACxB;;AAEA;IACI,yBAAyB;IACzB,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,WAAW;IACX,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,UAAU;AACd;;AAEA;IACI,cAAc;IACd,WAAW;IACX,eAAe;AACnB;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,aAAa;IACb,mBAAmB;IACnB,6BAA6B;IAC7B,UAAU;AACd;;AAEA;IACI,iBAAiB;IACjB,kBAAkB;IAClB,mBAAmB;AACvB;;AAEA;IACI,WAAW;IACX,aAAa;IACb,sBAAsB;IACtB,qBAAqB;IACrB,mBAAmB;IACnB,UAAU;AACd;;AAEA;IACI,iBAAiB;IACjB,cAAc;IACd,WAAW;IACX,kBAAkB;IAClB,kBAAkB;IAClB,mBAAmB;AACvB;;AAEA;IACI,gBAAgB;IAChB,SAAS;IACT,QAAQ;IACR,SAAS;AACb;;AAEA;IACI,yBAAyB;AAC7B","sourcesContent":["body {\n    margin: 0;\n    border: 0;\n    width: 100vw;\n    height: 100vh;\n    display: flex;\n    flex-direction: column;\n    font-family:\n        system-ui,\n        -apple-system,\n        BlinkMacSystemFont,\n        \"Segoe UI\",\n        Roboto,\n        Oxygen,\n        Ubuntu,\n        Cantarell,\n        \"Open Sans\",\n        \"Helvetica Neue\",\n        sans-serif;\n    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);\n    background-size: 400% 400%;\n    animation: gradient 7s ease infinite;\n}\n\n@keyframes gradient {\n    0% {\n        background-position: 0% 50%;\n    }\n    50% {\n        background-position: 100% 50%;\n    }\n    100% {\n        background-position: 0% 50%;\n    }\n}\n\nbutton:active {\n    background-color: #e2dad6;\n    border: 0.1rem solid #6482ad;\n    color: #6482ad;\n    transform: translateY(0.02rem);\n}\n\nfooter {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    background-color: #ee7652d8;\n    height: 10vh;\n}\n\nbutton {\n    border: #1f2937 0.1rem solid;\n    border-radius: 2rem;\n    background-color: rgb(247, 252, 255);\n    color: black;\n    align-self: center;\n}\n\nbutton:hover {\n    background-color: transparent;\n}\n\n.mainContainer {\n    flex-grow: 1;\n    margin: 0 3rem;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n    align-items: center;\n    background-image: url(\"./media/bagel.png\");\n    background-size: 14vh;\n    background-repeat: repeat;\n}\n\n.mainContainer div {\n    font-size: 2rem;\n    font-weight: 500;\n    background-color: #e2dad6b6;\n    padding: 2rem;\n    border-radius: 5rem;\n    margin-bottom: 1rem;\n}\n\n.boards {\n    width: 100%;\n    display: flex;\n    justify-content: space-evenly;\n}\n\n.p1,\n.p2 {\n    display: grid;\n    grid-template-columns: repeat(10, 2.5rem);\n    grid-template-rows: repeat(10, 2.5rem);\n}\n\n.mainContainer div.active {\n    background-color: #e73c7e;\n}\n\n.p1 button,\n.p2 button {\n    height: 2.43rem;\n    width: 2.43rem;\n    border: none;\n    border-radius: 0;\n}\n\n.ship {\n    background-color: #1f2937e5;\n}\n\n.missed {\n    background-color: #e2dad6c7;\n}\n\n.missed::after {\n    content: \"X\";\n}\n\n.hit {\n    color: #fafafa;\n    background-color: #e99e87;\n}\n\n.hit::after {\n    content: \"O\";\n}\n\n.set button:disabled {\n    background-color: #e2dad6c7;\n}\n\n.play button:not(:disabled) {\n    background-color: #e2dad6c7;\n}\n\n.hide {\n    background-color: #e2dad6c7;\n}\n\n.ghostShips {\n    display: grid;\n    background-color: #e2dad6b6;\n    position: fixed;\n    pointer-events: none;\n}\n\n.ghost {\n    background-color: #1f2937;\n    height: 2.43rem;\n    width: 2.43rem;\n}\n\n.btns {\n    width: 40vw;\n    display: flex;\n    align-items: center;\n    justify-content: space-evenly;\n    padding: 0;\n}\n\n.btns button {\n    height: 2.5rem;\n    width: 8rem;\n    font-size: 1rem;\n}\n\nfieldset {\n    border: none;\n    width: 40vw;\n    display: flex;\n    align-items: center;\n    justify-content: space-evenly;\n    padding: 0;\n}\n\nlegend {\n    font-size: 1.4rem;\n    text-align: center;\n    margin-bottom: 1rem;\n}\n\n.mainContainer fieldset div {\n    width: 10vw;\n    display: flex;\n    flex-direction: column;\n    justify-items: center;\n    align-items: center;\n    padding: 0;\n}\n\nlabel {\n    font-size: 1.2rem;\n    display: block;\n    width: 8rem;\n    text-align: center;\n    padding: 1rem 2rem;\n    border-radius: 5rem;\n}\n\ninput {\n    appearance: none;\n    height: 0;\n    width: 0;\n    margin: 0;\n}\n\nfieldset div:has(input:checked) {\n    background-color: #ee7752;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/media/bagel.png":
/*!*****************************!*\
  !*** ./src/media/bagel.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "011e568cd8a1127c3d2d.png";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameController */ "./src/gameController.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ship */ "./src/ship.js");




function ScreenController(player1, player2) {
  const game = (0,_gameController__WEBPACK_IMPORTED_MODULE_2__["default"])(player1, player2);
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
        if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          cellButton.classList.add("ship");
        }
        if (player1Board.missedAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("missed");
        } else if (player1Board.hitAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
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
        if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          cellButton.classList.add("ship");
        }
        if (player2Board.missedAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("missed");
        } else if (player2Board.hitAttacks.some(combo => Number(combo[0]) === rowIndex && Number(combo[1]) === columnIndex)) {
          cellButton.classList.add("hit");
        }
        player2BoardDiv.appendChild(cellButton);
      });
    });
    if (game.winCondition(opponent)) {
      const buttons1 = player1BoardDiv.querySelectorAll("button");
      buttons1.forEach(button => button.disabled = true);
      const buttons2 = player2BoardDiv.querySelectorAll("button");
      buttons2.forEach(button => button.disabled = true);
    } else {
      messageDiv1.textContent = `It's ${activePlayer.name}'s Turn!`;
    }
    if (player2.computer && activePlayer === player2 && !game.winCondition(opponent)) {
      comAutoMoves();
    }
  }
  function comAutoMoves() {
    if (player1Board.lastHit) {
      let [x, y] = player1Board.hitAttacks[player1Board.hitAttacks.length - 1];
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
    p1Btns.forEach(btn => {
      btn.classList.add("hide");
    });
    p2Btns.forEach(btn => {
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
  const player1 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("Player1");
  let player2 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("com", isCom);
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
  comRadio.addEventListener("change", e => {
    if (e.target.checked) {
      isCom = true;
    }
    player2 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("com", isCom);
    player2Board = player2.gameboard;
    player2Board.removeAllShip();
    player2Board.placeShipRandom();
    updateSettingBoard();
    restrictP2();
    resetStartButtonEvent();
  });
  p2Radio.addEventListener("change", e => {
    if (e.target.checked) {
      isCom = false;
    }
    player2 = new _player__WEBPACK_IMPORTED_MODULE_1__["default"]("Player2", isCom);
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
        if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
          cellButton.classList.add("ship");
          cellButton.addEventListener("mousedown", event => {
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
              const isVertical = ghostShip.dataset.isVertical === "true";
              if (player1Board.canPlaceShip(rowIndex, columnIndex, length, isVertical)) {
                player1Board.placeShip(rowIndex, columnIndex, length, isVertical);
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
          if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
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
          if (cell instanceof _ship__WEBPACK_IMPORTED_MODULE_3__["default"]) {
            cellButton.classList.add("ship");
            cellButton.addEventListener("mousedown", event => {
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
              const ghostShip = document.querySelector(".ghostShips");
              if (ghostShip) {
                const length = parseInt(ghostShip.dataset.length);
                const isVertical = ghostShip.dataset.isVertical === "true";
                if (player2Board.canPlaceShip(rowIndex, columnIndex, length, isVertical)) {
                  player2Board.placeShip(rowIndex, columnIndex, length, isVertical);
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
      if (!player2.computer && !document.querySelector(".p1").querySelector("button").disabled) {
        switchSettingBoard();
        return;
      }
      ScreenController(player1, player2);
    });
  }
  function switchSettingBoard() {
    const p1Btns = document.querySelector(".p1").querySelectorAll("button");
    const p2Btns = document.querySelector(".p2").querySelectorAll("button");
    p1Btns.forEach(btn => {
      btn.disabled = true;
    });
    p2Btns.forEach(btn => {
      btn.disabled = false;
    });
    comRadio.disabled = true;
    p2Radio.disabled = true;
    currentPlayer = player2;
    messageDiv1.textContent = "Place Player2's Ships! Press Start To Continue!";
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
  p1Btns.forEach(btn => {
    btn.disabled = true;
  });
}
function restrictP2() {
  const p2Btns = document.querySelector(".p2").querySelectorAll("button");
  p2Btns.forEach(btn => {
    btn.disabled = true;
  });
}
settingBoard();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZ0ZBQWdGLFVBQVUsVUFBVSxVQUFVLFVBQVUsVUFBVSxZQUFZLGdCQUFnQixNQUFNLFlBQVksYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLGFBQWEsYUFBYSxXQUFXLFlBQVksT0FBTyxLQUFLLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxVQUFVLFlBQVksYUFBYSxXQUFXLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFVBQVUsWUFBWSxhQUFhLE9BQU8sS0FBSyxZQUFZLE9BQU8sTUFBTSxVQUFVLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8s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LENBQUU0RyxHQUFHLElBQUs7SUFDcEJBLEdBQUcsQ0FBQ2xCLFFBQVEsR0FBRyxJQUFJO0VBQ3ZCLENBQUMsQ0FBQztBQUNOO0FBRUEsU0FBU3dCLFVBQVVBLENBQUEsRUFBRztFQUNsQixNQUFNUCxNQUFNLEdBQUdoRixRQUFRLENBQUMwQixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUNnRCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7RUFDdkVNLE1BQU0sQ0FBQzNHLE9BQU8sQ0FBRTRHLEdBQUcsSUFBSztJQUNwQkEsR0FBRyxDQUFDbEIsUUFBUSxHQUFHLElBQUk7RUFDdkIsQ0FBQyxDQUFDO0FBQ047QUFFQTJCLFlBQVksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvZ2FtZUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9zdHlsZS5jc3M/NzE2MyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEdhbWVDb250cm9sbGVyKHBsYXllcjEsIGNvbSkge1xuICAgIGxldCBhY3RpdmVQbGF5ZXIgPSBwbGF5ZXIxO1xuICAgIGxldCBuZXh0UGxheWVyID0gY29tO1xuICAgIGxldCB0ZW1wUGxheWVyO1xuICAgIGNvbnN0IGdldEFjdGl2ZVBsYXllciA9ICgpID0+IGFjdGl2ZVBsYXllcjtcbiAgICBjb25zdCBnZXRPcHBvbmVudCA9ICgpID0+IG5leHRQbGF5ZXI7XG5cbiAgICBjb25zdCBzd2l0Y2hQbGF5ZXJUdXJuID0gKCkgPT4ge1xuICAgICAgICB0ZW1wUGxheWVyID0gYWN0aXZlUGxheWVyO1xuICAgICAgICBhY3RpdmVQbGF5ZXIgPSBuZXh0UGxheWVyO1xuICAgICAgICBuZXh0UGxheWVyID0gdGVtcFBsYXllcjtcbiAgICB9O1xuXG4gICAgY29uc3Qgd2luQ29uZGl0aW9uID0gKG9wcG9uZW50KSA9PiB7XG4gICAgICAgIHJldHVybiBvcHBvbmVudC5nYW1lYm9hcmQuYWxsU2hpcHNTdW5rKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHBsYXlSb3VuZCA9ICh4LCB5KSA9PiB7XG4gICAgICAgIGxldCBtZXNzYWdlID0gYCR7YWN0aXZlUGxheWVyLm5hbWV9IGRyb3BwZWQgYSBib21iIHRvICR7bmV4dFBsYXllci5uYW1lfSdzIGJvYXJkLi4uYDtcbiAgICAgICAgaWYgKCFhY3RpdmVQbGF5ZXIuY2hlY2tBdHRhY2sobmV4dFBsYXllciwgeCwgeSkpIHtcbiAgICAgICAgICAgIG1lc3NhZ2UgPSBcIlRoaXMgQ29vcmRpbmF0ZSBoYXMgYmVlbiBib21iZWQhXCI7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdGl2ZVBsYXllci5hdHRhY2sobmV4dFBsYXllciwgeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdpbkNvbmRpdGlvbihuZXh0UGxheWVyKSkge1xuICAgICAgICAgICAgbWVzc2FnZSA9IGAke2FjdGl2ZVBsYXllci5uYW1lfSBXaW5zIWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2hQbGF5ZXJUdXJuKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfTtcblxuICAgIHJldHVybiB7IGdldEFjdGl2ZVBsYXllciwgZ2V0T3Bwb25lbnQsIHdpbkNvbmRpdGlvbiwgcGxheVJvdW5kIH07XG59XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiAxMCB9LCAoKSA9PiBBcnJheSgxMCkuZmlsbChudWxsKSk7XG4gICAgICAgIHRoaXMubWlzc2VkQXR0YWNrcyA9IFtdO1xuICAgICAgICB0aGlzLmhpdEF0dGFja3MgPSBbXTtcbiAgICAgICAgdGhpcy5zaGlwcyA9IFtdO1xuICAgICAgICB0aGlzLmxhc3RIaXQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBwbGFjZVNoaXBSYW5kb20oKSB7XG4gICAgICAgIGNvbnN0IHNoaXBMZW5ndGhzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgICAgIHNoaXBMZW5ndGhzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYWNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgd2hpbGUgKCFwbGFjZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIChpc1ZlcnRpY2FsID8gMTAgLSBsZW5ndGggOiAxMClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKFxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogKGlzVmVydGljYWwgPyAxMCA6IDEwIC0gbGVuZ3RoKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYW5QbGFjZVNoaXAoeCwgeSwgbGVuZ3RoLCBpc1ZlcnRpY2FsKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlU2hpcCh4LCB5LCBsZW5ndGgsIGlzVmVydGljYWwpO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2FuUGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgaXNWZXJ0aWNhbCA9IHRydWUpIHtcbiAgICAgICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgICAgICAgIGlmICh4ICsgbGVuZ3RoID4gMTApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2FyZFt4ICsgaV1beV0gIT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh5ICsgbGVuZ3RoID4gMTApIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2FyZFt4XVt5ICsgaV0gIT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwbGFjZVNoaXAoeCwgeSwgbGVuZ3RoLCBpc1ZlcnRpY2FsID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIXRoaXMuY2FuUGxhY2VTaGlwKHgsIHksIGxlbmd0aCwgaXNWZXJ0aWNhbCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNoaXAgPSBuZXcgU2hpcChsZW5ndGgsIGlzVmVydGljYWwpO1xuICAgICAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbeCArIGldW3ldID0gc2hpcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNoaXAuY29vcmQucHVzaCh4KTtcbiAgICAgICAgICAgIHNoaXAuY29vcmQucHVzaCh5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW3hdW3kgKyBpXSA9IHNoaXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzaGlwLmNvb3JkLnB1c2goeCk7XG4gICAgICAgICAgICBzaGlwLmNvb3JkLnB1c2goeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcy5wdXNoKHNoaXApO1xuICAgIH1cblxuICAgIHJlbW92ZUFsbFNoaXAoKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgMTA7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCAxMDsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm9hcmRbeF1beV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFt4XVt5XSA9IG51bGw7IC8vIFJlbW92ZSB0aGUgc2hpcCByZWZlcmVuY2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGlwcyA9IFtdO1xuICAgIH1cblxuICAgIHJlbW92ZVNoaXAoeCwgeSkge1xuICAgICAgICBpZiAoIXRoaXMuYm9hcmRbeF1beV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNoaXAgPSB0aGlzLmJvYXJkW3hdW3ldO1xuICAgICAgICAgICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXAubGVuZ3RoO1xuICAgICAgICAgICAgY29uc3Qgc2hpcEluZGV4ID0gdGhpcy5zaGlwcy5maW5kSW5kZXgoXG4gICAgICAgICAgICAgICAgKHRoZVNoaXApID0+XG4gICAgICAgICAgICAgICAgICAgIHRoZVNoaXAuY29vcmRbMF0gPT09IHNoaXAuY29vcmRbMF0gJiZcbiAgICAgICAgICAgICAgICAgICAgdGhlU2hpcC5jb29yZFsxXSA9PT0gc2hpcC5jb29yZFsxXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBzaGlwLmNvb3JkWzBdO1xuICAgICAgICAgICAgY29uc3QgYiA9IHNoaXAuY29vcmRbMV07XG4gICAgICAgICAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbYSArIGldW2JdID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2FdW2IgKyBpXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaGlwcy5zcGxpY2Uoc2hpcEluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlR2hvc3RTaGlwKHNoaXBMZW5ndGgsIHNoaXAuaXNWZXJ0aWNhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByb3RhdGVTaGlwKHgsIHkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmJvYXJkW3hdW3ldKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzaGlwID0gdGhpcy5ib2FyZFt4XVt5XTtcbiAgICAgICAgICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IG5ld0RpciA9ICFzaGlwLmlzVmVydGljYWw7XG4gICAgICAgICAgICBjb25zdCBhID0gc2hpcC5jb29yZFswXTtcbiAgICAgICAgICAgIGNvbnN0IGIgPSBzaGlwLmNvb3JkWzFdO1xuICAgICAgICAgICAgaWYgKHNoaXAuaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2EgKyBpXVtiXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2FyZFthXVtiICsgaV0gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmNhblBsYWNlU2hpcChhLCBiLCBzaGlwTGVuZ3RoLCBuZXdEaXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFjZVNoaXAoYSwgYiwgc2hpcExlbmd0aCwgbmV3RGlyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFuZXdEaXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvYXJkW2EgKyBpXVtiXSA9IHNoaXA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYm9hcmRbYV1bYiArIGldID0gc2hpcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUdob3N0U2hpcChsZW5ndGgsIGlzVmVydGljYWwpIHtcbiAgICAgICAgY29uc3QgY3JlYXRlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgICAgICAgIGNyZWF0ZUNvbnRhaW5lci5zdHlsZS5ncmlkVGVtcGxhdGVSb3dzID0gYHJlcGVhdCgke2xlbmd0aH0sIDIuNXJlbSlgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3JlYXRlQ29udGFpbmVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KCR7bGVuZ3RofSwgMi41cmVtKWA7XG4gICAgICAgIH1cbiAgICAgICAgY3JlYXRlQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJnaG9zdFNoaXBzXCIpO1xuICAgICAgICBjcmVhdGVDb250YWluZXIuZGF0YXNldC5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIGNyZWF0ZUNvbnRhaW5lci5kYXRhc2V0LmlzVmVydGljYWwgPSBpc1ZlcnRpY2FsO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGdob3N0U2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBnaG9zdFNoaXAuY2xhc3NMaXN0LmFkZChcImdob3N0XCIpO1xuICAgICAgICAgICAgY3JlYXRlQ29udGFpbmVyLmFwcGVuZENoaWxkKGdob3N0U2hpcCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbW92ZUN1cnNvciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeSA9IGV2ZW50LnBhZ2VZO1xuICAgICAgICAgICAgY29uc3QgeCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFggIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA/IHdpbmRvdy5zY3JvbGxYXG4gICAgICAgICAgICAgICAgICAgIDogKFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHlcbiAgICAgICAgICAgICAgICAgICAgICApLnNjcm9sbExlZnQ7XG4gICAgICAgICAgICBjb25zdCBzY3JvbGxUb3AgPVxuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxZICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgPyB3aW5kb3cuc2Nyb2xsWVxuICAgICAgICAgICAgICAgICAgICA6IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5XG4gICAgICAgICAgICAgICAgICAgICAgKS5zY3JvbGxUb3A7XG4gICAgICAgICAgICBjcmVhdGVDb250YWluZXIuc3R5bGUubGVmdCA9IHggLSBzY3JvbGxMZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgY3JlYXRlQ29udGFpbmVyLnN0eWxlLnRvcCA9IHkgLSBzY3JvbGxUb3AgKyBcInB4XCI7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY3JlYXRlQ29udGFpbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBtb3ZlQ3Vyc29yKTtcbiAgICB9XG5cbiAgICByZW1vdmVHaG9zdFNoaXAoKSB7XG4gICAgICAgIGNvbnN0IGdob3N0U2hpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZ2hvc3RTaGlwc1wiKTtcbiAgICAgICAgZ2hvc3RTaGlwLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgICAgICBpZiAodGhpcy5ib2FyZFt4XVt5XSkge1xuICAgICAgICAgICAgdGhpcy5ib2FyZFt4XVt5XS5oaXQoKTtcbiAgICAgICAgICAgIHRoaXMuaGl0QXR0YWNrcy5wdXNoKFt4LCB5XSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RIaXQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taXNzZWRBdHRhY2tzLnB1c2goW3gsIHldKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEhpdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxsU2hpcHNTdW5rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBpc0NvbXB1dGVyID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5nYW1lYm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG4gICAgICAgIHRoaXMuY29tcHV0ZXIgPSBpc0NvbXB1dGVyO1xuICAgIH1cblxuICAgIGF0dGFjayhvcHBvbmVudCwgeCwgeSkge1xuICAgICAgICByZXR1cm4gb3Bwb25lbnQuZ2FtZWJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG4gICAgfVxuXG4gICAgY2hlY2tBdHRhY2sob3Bwb25lbnQsIHgsIHkpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgb3Bwb25lbnQuZ2FtZWJvYXJkLmhpdEF0dGFja3Muc29tZShcbiAgICAgICAgICAgICAgICAoY29tYm8pID0+IGNvbWJvWzBdID09PSB4ICYmIGNvbWJvWzFdID09PSB5XG4gICAgICAgICAgICApIHx8XG4gICAgICAgICAgICBvcHBvbmVudC5nYW1lYm9hcmQubWlzc2VkQXR0YWNrcy5zb21lKFxuICAgICAgICAgICAgICAgIChjb21ibykgPT4gY29tYm9bMF0gPT09IHggJiYgY29tYm9bMV0gPT09IHlcbiAgICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJhbmRvbVBvcyhvcHBvbmVudCkge1xuICAgICAgICBsZXQgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICAgIGlmICghdGhpcy5jaGVja0F0dGFjayhvcHBvbmVudCwgeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJhbmRvbVBvcyhvcHBvbmVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldFJhbmRvbURpcmVjdGlvbihvcHBvbmVudCwgeCwgeSkge1xuICAgICAgICBjb25zdCBkaXJlY3Rpb25zID0gW1xuICAgICAgICAgICAgW3ggKyAxLCB5XSxcbiAgICAgICAgICAgIFt4IC0gMSwgeV0sXG4gICAgICAgICAgICBbeCwgeSArIDFdLFxuICAgICAgICAgICAgW3gsIHkgLSAxXSxcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCB2YWxpZERpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLmZpbHRlcigoY29tYm8pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFtuZXdYLCBuZXdZXSA9IGNvbWJvO1xuICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9XG4gICAgICAgICAgICAgICAgbmV3WCA+PSAwICYmXG4gICAgICAgICAgICAgICAgbmV3WCA8PSA5ICYmXG4gICAgICAgICAgICAgICAgbmV3WSA+PSAwICYmXG4gICAgICAgICAgICAgICAgbmV3WSA8PSA5ICYmXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja0F0dGFjayhvcHBvbmVudCwgbmV3WCwgbmV3WSk7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZCAmJiAhKG5ld1ggPT09IHggJiYgbmV3WSA9PT0geSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh2YWxpZERpcmVjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkRGlyZWN0aW9ucy5sZW5ndGgpO1xuICAgICAgICBjb25zdCBuZXdQb3MgPSB2YWxpZERpcmVjdGlvbnNbcmFuZG9tSW5kZXhdO1xuXG4gICAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3IobGVuZ3RoLCBpc1ZlcnRpY2FsKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLmJlZW5IaXQgPSAwO1xuICAgICAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb29yZCA9IFtdO1xuICAgICAgICB0aGlzLmlzVmVydGljYWwgPSBpc1ZlcnRpY2FsO1xuICAgIH1cblxuICAgIGhpdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuYmVlbkhpdCA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmJlZW5IaXQrKztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzU3VuaygpO1xuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMuYmVlbkhpdCA9PT0gdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuL21lZGlhL2JhZ2VsLnBuZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgYm9keSB7XG4gICAgbWFyZ2luOiAwO1xuICAgIGJvcmRlcjogMDtcbiAgICB3aWR0aDogMTAwdnc7XG4gICAgaGVpZ2h0OiAxMDB2aDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZm9udC1mYW1pbHk6XG4gICAgICAgIHN5c3RlbS11aSxcbiAgICAgICAgLWFwcGxlLXN5c3RlbSxcbiAgICAgICAgQmxpbmtNYWNTeXN0ZW1Gb250LFxuICAgICAgICBcIlNlZ29lIFVJXCIsXG4gICAgICAgIFJvYm90byxcbiAgICAgICAgT3h5Z2VuLFxuICAgICAgICBVYnVudHUsXG4gICAgICAgIENhbnRhcmVsbCxcbiAgICAgICAgXCJPcGVuIFNhbnNcIixcbiAgICAgICAgXCJIZWx2ZXRpY2EgTmV1ZVwiLFxuICAgICAgICBzYW5zLXNlcmlmO1xuICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgtNDVkZWcsICNlZTc3NTIsICNlNzNjN2UsICMyM2E2ZDUsICMyM2Q1YWIpO1xuICAgIGJhY2tncm91bmQtc2l6ZTogNDAwJSA0MDAlO1xuICAgIGFuaW1hdGlvbjogZ3JhZGllbnQgN3MgZWFzZSBpbmZpbml0ZTtcbn1cblxuQGtleWZyYW1lcyBncmFkaWVudCB7XG4gICAgMCUge1xuICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSA1MCU7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwMCUgNTAlO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUgNTAlO1xuICAgIH1cbn1cblxuYnV0dG9uOmFjdGl2ZSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNjtcbiAgICBib3JkZXI6IDAuMXJlbSBzb2xpZCAjNjQ4MmFkO1xuICAgIGNvbG9yOiAjNjQ4MmFkO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwLjAycmVtKTtcbn1cblxuZm9vdGVyIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VlNzY1MmQ4O1xuICAgIGhlaWdodDogMTB2aDtcbn1cblxuYnV0dG9uIHtcbiAgICBib3JkZXI6ICMxZjI5MzcgMC4xcmVtIHNvbGlkO1xuICAgIGJvcmRlci1yYWRpdXM6IDJyZW07XG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI0NywgMjUyLCAyNTUpO1xuICAgIGNvbG9yOiBibGFjaztcbiAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XG59XG5cbmJ1dHRvbjpob3ZlciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG5cbi5tYWluQ29udGFpbmVyIHtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAgbWFyZ2luOiAwIDNyZW07XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fX30pO1xuICAgIGJhY2tncm91bmQtc2l6ZTogMTR2aDtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogcmVwZWF0O1xufVxuXG4ubWFpbkNvbnRhaW5lciBkaXYge1xuICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZiNjtcbiAgICBwYWRkaW5nOiAycmVtO1xuICAgIGJvcmRlci1yYWRpdXM6IDVyZW07XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuLmJvYXJkcyB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbn1cblxuLnAxLFxuLnAyIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAyLjVyZW0pO1xuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLCAyLjVyZW0pO1xufVxuXG4ubWFpbkNvbnRhaW5lciBkaXYuYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTczYzdlO1xufVxuXG4ucDEgYnV0dG9uLFxuLnAyIGJ1dHRvbiB7XG4gICAgaGVpZ2h0OiAyLjQzcmVtO1xuICAgIHdpZHRoOiAyLjQzcmVtO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xufVxuXG4uc2hpcCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzFmMjkzN2U1O1xufVxuXG4ubWlzc2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2Yzc7XG59XG5cbi5taXNzZWQ6OmFmdGVyIHtcbiAgICBjb250ZW50OiBcIlhcIjtcbn1cblxuLmhpdCB7XG4gICAgY29sb3I6ICNmYWZhZmE7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2U5OWU4Nztcbn1cblxuLmhpdDo6YWZ0ZXIge1xuICAgIGNvbnRlbnQ6IFwiT1wiO1xufVxuXG4uc2V0IGJ1dHRvbjpkaXNhYmxlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmM3O1xufVxuXG4ucGxheSBidXR0b246bm90KDpkaXNhYmxlZCkge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZjNztcbn1cblxuLmhpZGUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZjNztcbn1cblxuLmdob3N0U2hpcHMge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmI2O1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuLmdob3N0IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWYyOTM3O1xuICAgIGhlaWdodDogMi40M3JlbTtcbiAgICB3aWR0aDogMi40M3JlbTtcbn1cblxuLmJ0bnMge1xuICAgIHdpZHRoOiA0MHZ3O1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcbiAgICBwYWRkaW5nOiAwO1xufVxuXG4uYnRucyBidXR0b24ge1xuICAgIGhlaWdodDogMi41cmVtO1xuICAgIHdpZHRoOiA4cmVtO1xuICAgIGZvbnQtc2l6ZTogMXJlbTtcbn1cblxuZmllbGRzZXQge1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICB3aWR0aDogNDB2dztcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgcGFkZGluZzogMDtcbn1cblxubGVnZW5kIHtcbiAgICBmb250LXNpemU6IDEuNHJlbTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbn1cblxuLm1haW5Db250YWluZXIgZmllbGRzZXQgZGl2IHtcbiAgICB3aWR0aDogMTB2dztcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1pdGVtczogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgcGFkZGluZzogMDtcbn1cblxubGFiZWwge1xuICAgIGZvbnQtc2l6ZTogMS4ycmVtO1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIHdpZHRoOiA4cmVtO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBwYWRkaW5nOiAxcmVtIDJyZW07XG4gICAgYm9yZGVyLXJhZGl1czogNXJlbTtcbn1cblxuaW5wdXQge1xuICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgaGVpZ2h0OiAwO1xuICAgIHdpZHRoOiAwO1xuICAgIG1hcmdpbjogMDtcbn1cblxuZmllbGRzZXQgZGl2OmhhcyhpbnB1dDpjaGVja2VkKSB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VlNzc1Mjtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtJQUNJLFNBQVM7SUFDVCxTQUFTO0lBQ1QsWUFBWTtJQUNaLGFBQWE7SUFDYixhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCOzs7Ozs7Ozs7OztrQkFXYztJQUNkLHVFQUF1RTtJQUN2RSwwQkFBMEI7SUFDMUIsb0NBQW9DO0FBQ3hDOztBQUVBO0lBQ0k7UUFDSSwyQkFBMkI7SUFDL0I7SUFDQTtRQUNJLDZCQUE2QjtJQUNqQztJQUNBO1FBQ0ksMkJBQTJCO0lBQy9CO0FBQ0o7O0FBRUE7SUFDSSx5QkFBeUI7SUFDekIsNEJBQTRCO0lBQzVCLGNBQWM7SUFDZCw4QkFBOEI7QUFDbEM7O0FBRUE7SUFDSSxhQUFhO0lBQ2IsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQiwyQkFBMkI7SUFDM0IsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLDRCQUE0QjtJQUM1QixtQkFBbUI7SUFDbkIsb0NBQW9DO0lBQ3BDLFlBQVk7SUFDWixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSw2QkFBNkI7QUFDakM7O0FBRUE7SUFDSSxZQUFZO0lBQ1osY0FBYztJQUNkLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsdUJBQXVCO0lBQ3ZCLG1CQUFtQjtJQUNuQix5REFBMEM7SUFDMUMscUJBQXFCO0lBQ3JCLHlCQUF5QjtBQUM3Qjs7QUFFQTtJQUNJLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsMkJBQTJCO0lBQzNCLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGFBQWE7SUFDYiw2QkFBNkI7QUFDakM7O0FBRUE7O0lBRUksYUFBYTtJQUNiLHlDQUF5QztJQUN6QyxzQ0FBc0M7QUFDMUM7O0FBRUE7SUFDSSx5QkFBeUI7QUFDN0I7O0FBRUE7O0lBRUksZUFBZTtJQUNmLGNBQWM7SUFDZCxZQUFZO0lBQ1osZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGNBQWM7SUFDZCx5QkFBeUI7QUFDN0I7O0FBRUE7SUFDSSxZQUFZO0FBQ2hCOztBQUVBO0lBQ0ksMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksMkJBQTJCO0FBQy9COztBQUVBO0lBQ0ksYUFBYTtJQUNiLDJCQUEyQjtJQUMzQixlQUFlO0lBQ2Ysb0JBQW9CO0FBQ3hCOztBQUVBO0lBQ0kseUJBQXlCO0lBQ3pCLGVBQWU7SUFDZixjQUFjO0FBQ2xCOztBQUVBO0lBQ0ksV0FBVztJQUNYLGFBQWE7SUFDYixtQkFBbUI7SUFDbkIsNkJBQTZCO0lBQzdCLFVBQVU7QUFDZDs7QUFFQTtJQUNJLGNBQWM7SUFDZCxXQUFXO0lBQ1gsZUFBZTtBQUNuQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixXQUFXO0lBQ1gsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQiw2QkFBNkI7SUFDN0IsVUFBVTtBQUNkOztBQUVBO0lBQ0ksaUJBQWlCO0lBQ2pCLGtCQUFrQjtJQUNsQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxXQUFXO0lBQ1gsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixxQkFBcUI7SUFDckIsbUJBQW1CO0lBQ25CLFVBQVU7QUFDZDs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQixjQUFjO0lBQ2QsV0FBVztJQUNYLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0ksZ0JBQWdCO0lBQ2hCLFNBQVM7SUFDVCxRQUFRO0lBQ1IsU0FBUztBQUNiOztBQUVBO0lBQ0kseUJBQXlCO0FBQzdCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcImJvZHkge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIGJvcmRlcjogMDtcXG4gICAgd2lkdGg6IDEwMHZ3O1xcbiAgICBoZWlnaHQ6IDEwMHZoO1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBmb250LWZhbWlseTpcXG4gICAgICAgIHN5c3RlbS11aSxcXG4gICAgICAgIC1hcHBsZS1zeXN0ZW0sXFxuICAgICAgICBCbGlua01hY1N5c3RlbUZvbnQsXFxuICAgICAgICBcXFwiU2Vnb2UgVUlcXFwiLFxcbiAgICAgICAgUm9ib3RvLFxcbiAgICAgICAgT3h5Z2VuLFxcbiAgICAgICAgVWJ1bnR1LFxcbiAgICAgICAgQ2FudGFyZWxsLFxcbiAgICAgICAgXFxcIk9wZW4gU2Fuc1xcXCIsXFxuICAgICAgICBcXFwiSGVsdmV0aWNhIE5ldWVcXFwiLFxcbiAgICAgICAgc2Fucy1zZXJpZjtcXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KC00NWRlZywgI2VlNzc1MiwgI2U3M2M3ZSwgIzIzYTZkNSwgIzIzZDVhYik7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogNDAwJSA0MDAlO1xcbiAgICBhbmltYXRpb246IGdyYWRpZW50IDdzIGVhc2UgaW5maW5pdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgZ3JhZGllbnQge1xcbiAgICAwJSB7XFxuICAgICAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAwJSA1MCU7XFxuICAgIH1cXG4gICAgNTAlIHtcXG4gICAgICAgIGJhY2tncm91bmQtcG9zaXRpb246IDEwMCUgNTAlO1xcbiAgICB9XFxuICAgIDEwMCUge1xcbiAgICAgICAgYmFja2dyb3VuZC1wb3NpdGlvbjogMCUgNTAlO1xcbiAgICB9XFxufVxcblxcbmJ1dHRvbjphY3RpdmUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2O1xcbiAgICBib3JkZXI6IDAuMXJlbSBzb2xpZCAjNjQ4MmFkO1xcbiAgICBjb2xvcjogIzY0ODJhZDtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDAuMDJyZW0pO1xcbn1cXG5cXG5mb290ZXIge1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VlNzY1MmQ4O1xcbiAgICBoZWlnaHQ6IDEwdmg7XFxufVxcblxcbmJ1dHRvbiB7XFxuICAgIGJvcmRlcjogIzFmMjkzNyAwLjFyZW0gc29saWQ7XFxuICAgIGJvcmRlci1yYWRpdXM6IDJyZW07XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHJnYigyNDcsIDI1MiwgMjU1KTtcXG4gICAgY29sb3I6IGJsYWNrO1xcbiAgICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcblxcbmJ1dHRvbjpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4ubWFpbkNvbnRhaW5lciB7XFxuICAgIGZsZXgtZ3JvdzogMTtcXG4gICAgbWFyZ2luOiAwIDNyZW07XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXFxcIi4vbWVkaWEvYmFnZWwucG5nXFxcIik7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTR2aDtcXG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IHJlcGVhdDtcXG59XFxuXFxuLm1haW5Db250YWluZXIgZGl2IHtcXG4gICAgZm9udC1zaXplOiAycmVtO1xcbiAgICBmb250LXdlaWdodDogNTAwO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2YjY7XFxuICAgIHBhZGRpbmc6IDJyZW07XFxuICAgIGJvcmRlci1yYWRpdXM6IDVyZW07XFxuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XFxufVxcblxcbi5ib2FyZHMge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxufVxcblxcbi5wMSxcXG4ucDIge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMi41cmVtKTtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDIuNXJlbSk7XFxufVxcblxcbi5tYWluQ29udGFpbmVyIGRpdi5hY3RpdmUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTczYzdlO1xcbn1cXG5cXG4ucDEgYnV0dG9uLFxcbi5wMiBidXR0b24ge1xcbiAgICBoZWlnaHQ6IDIuNDNyZW07XFxuICAgIHdpZHRoOiAyLjQzcmVtO1xcbiAgICBib3JkZXI6IG5vbmU7XFxuICAgIGJvcmRlci1yYWRpdXM6IDA7XFxufVxcblxcbi5zaGlwIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzFmMjkzN2U1O1xcbn1cXG5cXG4ubWlzc2VkIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmM3O1xcbn1cXG5cXG4ubWlzc2VkOjphZnRlciB7XFxuICAgIGNvbnRlbnQ6IFxcXCJYXFxcIjtcXG59XFxuXFxuLmhpdCB7XFxuICAgIGNvbG9yOiAjZmFmYWZhO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTk5ZTg3O1xcbn1cXG5cXG4uaGl0OjphZnRlciB7XFxuICAgIGNvbnRlbnQ6IFxcXCJPXFxcIjtcXG59XFxuXFxuLnNldCBidXR0b246ZGlzYWJsZWQge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2Yzc7XFxufVxcblxcbi5wbGF5IGJ1dHRvbjpub3QoOmRpc2FibGVkKSB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNlMmRhZDZjNztcXG59XFxuXFxuLmhpZGUge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJkYWQ2Yzc7XFxufVxcblxcbi5naG9zdFNoaXBzIHtcXG4gICAgZGlzcGxheTogZ3JpZDtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZGFkNmI2O1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xcbn1cXG5cXG4uZ2hvc3Qge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWYyOTM3O1xcbiAgICBoZWlnaHQ6IDIuNDNyZW07XFxuICAgIHdpZHRoOiAyLjQzcmVtO1xcbn1cXG5cXG4uYnRucyB7XFxuICAgIHdpZHRoOiA0MHZ3O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG4gICAgcGFkZGluZzogMDtcXG59XFxuXFxuLmJ0bnMgYnV0dG9uIHtcXG4gICAgaGVpZ2h0OiAyLjVyZW07XFxuICAgIHdpZHRoOiA4cmVtO1xcbiAgICBmb250LXNpemU6IDFyZW07XFxufVxcblxcbmZpZWxkc2V0IHtcXG4gICAgYm9yZGVyOiBub25lO1xcbiAgICB3aWR0aDogNDB2dztcXG4gICAgZGlzcGxheTogZmxleDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XFxuICAgIHBhZGRpbmc6IDA7XFxufVxcblxcbmxlZ2VuZCB7XFxuICAgIGZvbnQtc2l6ZTogMS40cmVtO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIG1hcmdpbi1ib3R0b206IDFyZW07XFxufVxcblxcbi5tYWluQ29udGFpbmVyIGZpZWxkc2V0IGRpdiB7XFxuICAgIHdpZHRoOiAxMHZ3O1xcbiAgICBkaXNwbGF5OiBmbGV4O1xcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIHBhZGRpbmc6IDA7XFxufVxcblxcbmxhYmVsIHtcXG4gICAgZm9udC1zaXplOiAxLjJyZW07XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICB3aWR0aDogOHJlbTtcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICBwYWRkaW5nOiAxcmVtIDJyZW07XFxuICAgIGJvcmRlci1yYWRpdXM6IDVyZW07XFxufVxcblxcbmlucHV0IHtcXG4gICAgYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgaGVpZ2h0OiAwO1xcbiAgICB3aWR0aDogMDtcXG4gICAgbWFyZ2luOiAwO1xcbn1cXG5cXG5maWVsZHNldCBkaXY6aGFzKGlucHV0OmNoZWNrZWQpIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2VlNzc1MjtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xub3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdCAmJiBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnRhZ05hbWUudG9VcHBlckNhc2UoKSA9PT0gJ1NDUklQVCcpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkge1xuXHRcdFx0dmFyIGkgPSBzY3JpcHRzLmxlbmd0aCAtIDE7XG5cdFx0XHR3aGlsZSAoaSA+IC0xICYmICghc2NyaXB0VXJsIHx8ICEvXmh0dHAocz8pOi8udGVzdChzY3JpcHRVcmwpKSkgc2NyaXB0VXJsID0gc2NyaXB0c1tpLS1dLnNyYztcblx0XHR9XG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3N0eWxlLmNzc1wiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBHYW1lQ29udHJvbGxlciBmcm9tIFwiLi9nYW1lQ29udHJvbGxlclwiO1xuaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5mdW5jdGlvbiBTY3JlZW5Db250cm9sbGVyKHBsYXllcjEsIHBsYXllcjIpIHtcbiAgICBjb25zdCBnYW1lID0gR2FtZUNvbnRyb2xsZXIocGxheWVyMSwgcGxheWVyMik7XG4gICAgY29uc3QgcGxheWVyMUJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMVwiKTtcbiAgICBjb25zdCBwbGF5ZXIyQm9hcmREaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAyXCIpO1xuICAgIGNvbnN0IG1lc3NhZ2VEaXYxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tc2cxXCIpO1xuICAgIGNvbnN0IG1lc3NhZ2VEaXYyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tc2cyXCIpO1xuICAgIGNvbnN0IHBsYXllcjFCb2FyZCA9IHBsYXllcjEuZ2FtZWJvYXJkO1xuICAgIGNvbnN0IHBsYXllcjJCb2FyZCA9IHBsYXllcjIuZ2FtZWJvYXJkO1xuICAgIGNvbnN0IHJhbmRvbVBsYWNlQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyYW5kb21cIik7XG4gICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N0YXJ0XCIpO1xuICAgIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jlc3RhcnRcIik7XG4gICAgY29uc3QgY29tUmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbVwiKTtcbiAgICBjb25zdCBwMlJhZGlvID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwMk1vZGVcIik7XG5cbiAgICByYW5kb21QbGFjZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgc3RhcnRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIHJlc3RhcnRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBjb21SYWRpby5kaXNhYmxlZCA9IHRydWU7XG4gICAgcDJSYWRpby5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBwbGF5ZXIxQm9hcmREaXYuY2xhc3NMaXN0LnJlbW92ZShcInNldFwiKTtcbiAgICBwbGF5ZXIyQm9hcmREaXYuY2xhc3NMaXN0LnJlbW92ZShcInNldFwiKTtcbiAgICBwbGF5ZXIxQm9hcmREaXYuY2xhc3NMaXN0LmFkZChcInBsYXlcIik7XG4gICAgcGxheWVyMkJvYXJkRGl2LmNsYXNzTGlzdC5hZGQoXCJwbGF5XCIpO1xuXG4gICAgZnVuY3Rpb24gdXBkYXRlQm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVBsYXllciA9IGdhbWUuZ2V0QWN0aXZlUGxheWVyKCk7XG4gICAgICAgIGNvbnN0IG9wcG9uZW50ID0gZ2FtZS5nZXRPcHBvbmVudCgpO1xuXG4gICAgICAgIGlmIChhY3RpdmVQbGF5ZXIubmFtZSA9PT0gcGxheWVyMS5uYW1lKSB7XG4gICAgICAgICAgICBwbGF5ZXIxQm9hcmREaXYuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZERpdi5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGxheWVyMUJvYXJkRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICBwbGF5ZXIyQm9hcmREaXYuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBsYXllcjFCb2FyZERpdi50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIHBsYXllcjFCb2FyZC5ib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICByb3cuZm9yRWFjaCgoY2VsbCwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjZWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGF0YXNldC5yb3cgPSByb3dJbmRleDtcbiAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQuY29sdW1uID0gY29sdW1uSW5kZXg7XG5cbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlUGxheWVyLm5hbWUgIT09IHBsYXllcjEubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjZWxsIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5taXNzZWRBdHRhY2tzLnNvbWUoXG4gICAgICAgICAgICAgICAgICAgICAgICAoY29tYm8pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKGNvbWJvWzBdKSA9PT0gcm93SW5kZXggJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoY29tYm9bMV0pID09PSBjb2x1bW5JbmRleFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcIm1pc3NlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQuaGl0QXR0YWNrcy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvbWJvKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihjb21ib1swXSkgPT09IHJvd0luZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKGNvbWJvWzFdKSA9PT0gY29sdW1uSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZERpdi5hcHBlbmRDaGlsZChjZWxsQnV0dG9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBwbGF5ZXIyQm9hcmREaXYudGV4dENvbnRlbnQgPSBcIlwiO1xuICAgICAgICBwbGF5ZXIyQm9hcmQuYm9hcmQuZm9yRWFjaCgocm93LCByb3dJbmRleCkgPT4ge1xuICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQucm93ID0gcm93SW5kZXg7XG4gICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kYXRhc2V0LmNvbHVtbiA9IGNvbHVtbkluZGV4O1xuXG4gICAgICAgICAgICAgICAgaWYgKGFjdGl2ZVBsYXllci5uYW1lICE9PSBwbGF5ZXIyLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2VsbCBpbnN0YW5jZW9mIFNoaXApIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQubWlzc2VkQXR0YWNrcy5zb21lKFxuICAgICAgICAgICAgICAgICAgICAgICAgKGNvbWJvKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihjb21ib1swXSkgPT09IHJvd0luZGV4ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTnVtYmVyKGNvbWJvWzFdKSA9PT0gY29sdW1uSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJtaXNzZWRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLmhpdEF0dGFja3Muc29tZShcbiAgICAgICAgICAgICAgICAgICAgICAgIChjb21ibykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBOdW1iZXIoY29tYm9bMF0pID09PSByb3dJbmRleCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE51bWJlcihjb21ib1sxXSkgPT09IGNvbHVtbkluZGV4XG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmREaXYuYXBwZW5kQ2hpbGQoY2VsbEJ1dHRvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGdhbWUud2luQ29uZGl0aW9uKG9wcG9uZW50KSkge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uczEgPSBwbGF5ZXIxQm9hcmREaXYucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIGJ1dHRvbnMxLmZvckVhY2goKGJ1dHRvbikgPT4gKGJ1dHRvbi5kaXNhYmxlZCA9IHRydWUpKTtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbnMyID0gcGxheWVyMkJvYXJkRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgICAgICAgICBidXR0b25zMi5mb3JFYWNoKChidXR0b24pID0+IChidXR0b24uZGlzYWJsZWQgPSB0cnVlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXNzYWdlRGl2MS50ZXh0Q29udGVudCA9IGBJdCdzICR7YWN0aXZlUGxheWVyLm5hbWV9J3MgVHVybiFgO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgcGxheWVyMi5jb21wdXRlciAmJlxuICAgICAgICAgICAgYWN0aXZlUGxheWVyID09PSBwbGF5ZXIyICYmXG4gICAgICAgICAgICAhZ2FtZS53aW5Db25kaXRpb24ob3Bwb25lbnQpXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29tQXV0b01vdmVzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21BdXRvTW92ZXMoKSB7XG4gICAgICAgIGlmIChwbGF5ZXIxQm9hcmQubGFzdEhpdCkge1xuICAgICAgICAgICAgbGV0IFt4LCB5XSA9XG4gICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLmhpdEF0dGFja3NbcGxheWVyMUJvYXJkLmhpdEF0dGFja3MubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBsZXQgbmV3UG9zID0gcGxheWVyMi5nZXRSYW5kb21EaXJlY3Rpb24ocGxheWVyMSwgeCwgeSk7XG4gICAgICAgICAgICBpZiAobmV3UG9zKSB7XG4gICAgICAgICAgICAgICAgW3gsIHldID0gbmV3UG9zO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBbeCwgeV0gPSBwbGF5ZXIyLmdldFJhbmRvbVBvcyhwbGF5ZXIxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1lc3NhZ2VEaXYyLnRleHRDb250ZW50ID0gZ2FtZS5wbGF5Um91bmQoeCwgeSk7XG4gICAgICAgICAgICB1cGRhdGVCb2FyZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IFt4LCB5XSA9IHBsYXllcjIuZ2V0UmFuZG9tUG9zKHBsYXllcjEpO1xuICAgICAgICAgICAgbWVzc2FnZURpdjIudGV4dENvbnRlbnQgPSBnYW1lLnBsYXlSb3VuZCh4LCB5KTtcbiAgICAgICAgICAgIHVwZGF0ZUJvYXJkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhpZGVCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgcDFCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgICAgICBjb25zdCBwMkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAyXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgICAgIHAxQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHAyQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYm9hcmRDbGlja0hhbmRsZXIoZSkge1xuICAgICAgICBjb25zdCBzZWxlY3RlZFJvdyA9IGUudGFyZ2V0LmRhdGFzZXQucm93O1xuICAgICAgICBjb25zdCBzZWxlY3RlZENvbHVtbiA9IGUudGFyZ2V0LmRhdGFzZXQuY29sdW1uO1xuXG4gICAgICAgIGlmICghc2VsZWN0ZWRSb3cgfHwgIXNlbGVjdGVkQ29sdW1uKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBtZXNzYWdlRGl2Mi50ZXh0Q29udGVudCA9IGdhbWUucGxheVJvdW5kKHNlbGVjdGVkUm93LCBzZWxlY3RlZENvbHVtbik7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVBsYXllciA9IGdhbWUuZ2V0QWN0aXZlUGxheWVyKCk7XG4gICAgICAgIHVwZGF0ZUJvYXJkKCk7XG4gICAgICAgIGlmICghcGxheWVyMi5jb21wdXRlcikge1xuICAgICAgICAgICAgaWYgKGFjdGl2ZVBsYXllci5uYW1lID09PSBwbGF5ZXIxLm5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdFAyKCk7XG4gICAgICAgICAgICAgICAgaGlkZUJvYXJkKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGl2ZVBsYXllci5uYW1lID09PSBwbGF5ZXIyLm5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXN0cmljdFAxKCk7XG4gICAgICAgICAgICAgICAgaGlkZUJvYXJkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB1cGRhdGVCb2FyZCgpO1xuICAgICAgICAgICAgfSwgMzAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5ZXIxQm9hcmREaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJvYXJkQ2xpY2tIYW5kbGVyKTtcbiAgICBwbGF5ZXIyQm9hcmREaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJvYXJkQ2xpY2tIYW5kbGVyKTtcblxuICAgIHVwZGF0ZUJvYXJkKCk7XG59XG5cbmZ1bmN0aW9uIHNldHRpbmdCb2FyZCgpIHtcbiAgICBjb25zdCBjb21SYWRpbyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29tXCIpO1xuICAgIGNvbnN0IHAyUmFkaW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3AyTW9kZVwiKTtcbiAgICBsZXQgaXNDb20gPSBjb21SYWRpby5jaGVja2VkO1xuICAgIGNvbnN0IHBsYXllcjEgPSBuZXcgUGxheWVyKFwiUGxheWVyMVwiKTtcbiAgICBsZXQgcGxheWVyMiA9IG5ldyBQbGF5ZXIoXCJjb21cIiwgaXNDb20pO1xuICAgIGNvbnN0IHBsYXllcjFCb2FyZERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDFcIik7XG4gICAgY29uc3QgcGxheWVyMkJvYXJkRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMlwiKTtcbiAgICBjb25zdCBtZXNzYWdlRGl2MSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubXNnMVwiKTtcbiAgICBjb25zdCBtZXNzYWdlRGl2MiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubXNnMlwiKTtcbiAgICBjb25zdCBwbGF5ZXIxQm9hcmQgPSBwbGF5ZXIxLmdhbWVib2FyZDtcbiAgICBsZXQgcGxheWVyMkJvYXJkID0gcGxheWVyMi5nYW1lYm9hcmQ7XG4gICAgY29uc3QgcmFuZG9tUGxhY2VCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3JhbmRvbVwiKTtcbiAgICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIik7XG4gICAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcmVzdGFydFwiKTtcbiAgICBsZXQgY3VycmVudFBsYXllciA9IHBsYXllcjE7XG5cbiAgICBjb21SYWRpby5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgICAgICBpc0NvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyMiA9IG5ldyBQbGF5ZXIoXCJjb21cIiwgaXNDb20pO1xuICAgICAgICBwbGF5ZXIyQm9hcmQgPSBwbGF5ZXIyLmdhbWVib2FyZDtcbiAgICAgICAgcGxheWVyMkJvYXJkLnJlbW92ZUFsbFNoaXAoKTtcbiAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcFJhbmRvbSgpO1xuICAgICAgICB1cGRhdGVTZXR0aW5nQm9hcmQoKTtcbiAgICAgICAgcmVzdHJpY3RQMigpO1xuICAgICAgICByZXNldFN0YXJ0QnV0dG9uRXZlbnQoKTtcbiAgICB9KTtcbiAgICBwMlJhZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKGUpID0+IHtcbiAgICAgICAgaWYgKGUudGFyZ2V0LmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGlzQ29tID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcGxheWVyMiA9IG5ldyBQbGF5ZXIoXCJQbGF5ZXIyXCIsIGlzQ29tKTtcbiAgICAgICAgcGxheWVyMkJvYXJkID0gcGxheWVyMi5nYW1lYm9hcmQ7XG4gICAgICAgIHBsYXllcjJCb2FyZC5yZW1vdmVBbGxTaGlwKCk7XG4gICAgICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXBSYW5kb20oKTtcbiAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgIHJlc3RyaWN0UDIoKTtcbiAgICAgICAgcmVzZXRTdGFydEJ1dHRvbkV2ZW50KCk7XG4gICAgfSk7XG5cbiAgICByYW5kb21QbGFjZUJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgIHN0YXJ0QnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgcmVzdGFydEJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gICAgY29tUmFkaW8uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICBwMlJhZGlvLmRpc2FibGVkID0gZmFsc2U7XG5cbiAgICBwbGF5ZXIxQm9hcmREaXYuY2xhc3NMaXN0LnJlbW92ZShcInBsYXlcIik7XG4gICAgcGxheWVyMkJvYXJkRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJwbGF5XCIpO1xuICAgIHBsYXllcjFCb2FyZERpdi5jbGFzc0xpc3QuYWRkKFwic2V0XCIpO1xuICAgIHBsYXllcjJCb2FyZERpdi5jbGFzc0xpc3QuYWRkKFwic2V0XCIpO1xuXG4gICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcFJhbmRvbSgpO1xuICAgIHBsYXllcjJCb2FyZC5wbGFjZVNoaXBSYW5kb20oKTtcblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVNldHRpbmdCb2FyZCgpIHtcbiAgICAgICAgcGxheWVyMUJvYXJkRGl2LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgcGxheWVyMUJvYXJkLmJvYXJkLmZvckVhY2goKHJvdywgcm93SW5kZXgpID0+IHtcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKChjZWxsLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kYXRhc2V0LnJvdyA9IHJvd0luZGV4O1xuICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGF0YXNldC5jb2x1bW4gPSBjb2x1bW5JbmRleDtcblxuICAgICAgICAgICAgICAgIGlmIChjZWxsIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYnV0dG9uID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQucm90YXRlU2hpcChyb3dJbmRleCwgY29sdW1uSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdCb2FyZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RyaWN0UDIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmQucmVtb3ZlU2hpcChyb3dJbmRleCwgY29sdW1uSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN0cmljdFAyKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2hvc3RTaGlwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5naG9zdFNoaXBzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdob3N0U2hpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IHBhcnNlSW50KGdob3N0U2hpcC5kYXRhc2V0Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdob3N0U2hpcC5kYXRhc2V0LmlzVmVydGljYWwgPT09IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLmNhblBsYWNlU2hpcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZlcnRpY2FsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMUJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZlcnRpY2FsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjFCb2FyZC5yZW1vdmVHaG9zdFNoaXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3RyaWN0UDIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBwbGF5ZXIxQm9hcmREaXYuYXBwZW5kQ2hpbGQoY2VsbEJ1dHRvbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGxheWVyMkJvYXJkRGl2LnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgaWYgKHBsYXllcjIuY29tcHV0ZXIpIHtcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5ib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQucm93ID0gcm93SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGF0YXNldC5jb2x1bW4gPSBjb2x1bW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjZWxsIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmREaXYuYXBwZW5kQ2hpbGQoY2VsbEJ1dHRvbik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBsYXllcjJCb2FyZC5ib2FyZC5mb3JFYWNoKChyb3csIHJvd0luZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goKGNlbGwsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNlbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmRhdGFzZXQucm93ID0gcm93SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIGNlbGxCdXR0b24uZGF0YXNldC5jb2x1bW4gPSBjb2x1bW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGwgaW5zdGFuY2VvZiBTaGlwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2VsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5idXR0b24gPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQucm90YXRlU2hpcChyb3dJbmRleCwgY29sdW1uSW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVTZXR0aW5nQm9hcmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdHJpY3RQMSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5yZW1vdmVTaGlwKHJvd0luZGV4LCBjb2x1bW5JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdHJpY3RQMSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjZWxsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBnaG9zdFNoaXAgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmdob3N0U2hpcHNcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdob3N0U2hpcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBwYXJzZUludChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdob3N0U2hpcC5kYXRhc2V0Lmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdob3N0U2hpcC5kYXRhc2V0LmlzVmVydGljYWwgPT09IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5ZXIyQm9hcmQuY2FuUGxhY2VTaGlwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvd0luZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbkluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1ZlcnRpY2FsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dJbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5JbmRleCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWZXJ0aWNhbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXllcjJCb2FyZC5yZW1vdmVHaG9zdFNoaXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVNldHRpbmdCb2FyZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdHJpY3RQMSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGxheWVyMkJvYXJkRGl2LmFwcGVuZENoaWxkKGNlbGxCdXR0b24pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gcmVzZXRTdGFydEJ1dHRvbkV2ZW50KCkge1xuICAgICAgICAvLyBDbG9uZSB0aGUgc3RhcnQgYnV0dG9uIHRvIGNsZWFyIHByZXZpb3VzIGV2ZW50c1xuICAgICAgICBjb25zdCBuZXdTdGFydEJ0biA9IHN0YXJ0QnRuLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgc3RhcnRCdG4ucmVwbGFjZVdpdGgobmV3U3RhcnRCdG4pO1xuICAgICAgICAvLyBBdHRhY2ggdGhlIG5ldyBldmVudCBsaXN0ZW5lclxuICAgICAgICBuZXdTdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICFwbGF5ZXIyLmNvbXB1dGVyICYmXG4gICAgICAgICAgICAgICAgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDFcIikucXVlcnlTZWxlY3RvcihcImJ1dHRvblwiKS5kaXNhYmxlZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoU2V0dGluZ0JvYXJkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgU2NyZWVuQ29udHJvbGxlcihwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3dpdGNoU2V0dGluZ0JvYXJkKCkge1xuICAgICAgICBjb25zdCBwMUJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAxXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgICAgIGNvbnN0IHAyQnRucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucDJcIikucXVlcnlTZWxlY3RvckFsbChcImJ1dHRvblwiKTtcbiAgICAgICAgcDFCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIHAyQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgICAgIGJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICAgICAgY29tUmFkaW8uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICBwMlJhZGlvLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgY3VycmVudFBsYXllciA9IHBsYXllcjI7XG4gICAgICAgIG1lc3NhZ2VEaXYxLnRleHRDb250ZW50ID1cbiAgICAgICAgICAgIFwiUGxhY2UgUGxheWVyMidzIFNoaXBzISBQcmVzcyBTdGFydCBUbyBDb250aW51ZSFcIjtcbiAgICB9XG5cbiAgICBtZXNzYWdlRGl2MS50ZXh0Q29udGVudCA9IFwiUGxhY2UgUGxheWVyMSdzIFNoaXBzISBQcmVzcyBTdGFydCBUbyBDb250aW51ZSFcIjtcbiAgICBtZXNzYWdlRGl2Mi50ZXh0Q29udGVudCA9IFwiQ2xpY2sgTWlkZGxlIE1vdXNlIFRvIFJvdGF0ZSBUaGUgU2hpcCFcIjtcbiAgICB1cGRhdGVTZXR0aW5nQm9hcmQoKTtcbiAgICByZXN0cmljdFAyKCk7XG5cbiAgICByYW5kb21QbGFjZUJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBjdXJyZW50UGxheWVyLmdhbWVib2FyZC5yZW1vdmVBbGxTaGlwKCk7XG4gICAgICAgIGN1cnJlbnRQbGF5ZXIuZ2FtZWJvYXJkLnBsYWNlU2hpcFJhbmRvbSgpO1xuICAgICAgICB1cGRhdGVTZXR0aW5nQm9hcmQoKTtcbiAgICAgICAgY3VycmVudFBsYXllciA9PSBwbGF5ZXIxID8gcmVzdHJpY3RQMigpIDogcmVzdHJpY3RQMSgpO1xuICAgIH0pO1xuICAgIHJlc2V0U3RhcnRCdXR0b25FdmVudChwbGF5ZXIxLCBwbGF5ZXIyKTtcbiAgICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIHBsYXllcjFCb2FyZC5zaGlwcyA9IFtdO1xuICAgICAgICBwbGF5ZXIxQm9hcmQubWlzc2VkQXR0YWNrcyA9IFtdO1xuICAgICAgICBwbGF5ZXIxQm9hcmQuaGl0QXR0YWNrcyA9IFtdO1xuICAgICAgICBwbGF5ZXIyQm9hcmQuc2hpcHMgPSBbXTtcbiAgICAgICAgcGxheWVyMkJvYXJkLm1pc3NlZEF0dGFja3MgPSBbXTtcbiAgICAgICAgcGxheWVyMkJvYXJkLmhpdEF0dGFja3MgPSBbXTtcbiAgICAgICAgc2V0dGluZ0JvYXJkKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlc3RyaWN0UDEoKSB7XG4gICAgY29uc3QgcDFCdG5zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wMVwiKS5xdWVyeVNlbGVjdG9yQWxsKFwiYnV0dG9uXCIpO1xuICAgIHAxQnRucy5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzdHJpY3RQMigpIHtcbiAgICBjb25zdCBwMkJ0bnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnAyXCIpLnF1ZXJ5U2VsZWN0b3JBbGwoXCJidXR0b25cIik7XG4gICAgcDJCdG5zLmZvckVhY2goKGJ0bikgPT4ge1xuICAgICAgICBidG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH0pO1xufVxuXG5zZXR0aW5nQm9hcmQoKTtcbiJdLCJuYW1lcyI6WyJHYW1lQ29udHJvbGxlciIsInBsYXllcjEiLCJjb20iLCJhY3RpdmVQbGF5ZXIiLCJuZXh0UGxheWVyIiwidGVtcFBsYXllciIsImdldEFjdGl2ZVBsYXllciIsImdldE9wcG9uZW50Iiwic3dpdGNoUGxheWVyVHVybiIsIndpbkNvbmRpdGlvbiIsIm9wcG9uZW50IiwiZ2FtZWJvYXJkIiwiYWxsU2hpcHNTdW5rIiwicGxheVJvdW5kIiwieCIsInkiLCJtZXNzYWdlIiwibmFtZSIsImNoZWNrQXR0YWNrIiwiYXR0YWNrIiwiU2hpcCIsIkdhbWVib2FyZCIsImNvbnN0cnVjdG9yIiwiYm9hcmQiLCJBcnJheSIsImZyb20iLCJsZW5ndGgiLCJmaWxsIiwibWlzc2VkQXR0YWNrcyIsImhpdEF0dGFja3MiLCJzaGlwcyIsImxhc3RIaXQiLCJwbGFjZVNoaXBSYW5kb20iLCJzaGlwTGVuZ3RocyIsImZvckVhY2giLCJwbGFjZWQiLCJpc1ZlcnRpY2FsIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwiY2FuUGxhY2VTaGlwIiwicGxhY2VTaGlwIiwiYXJndW1lbnRzIiwidW5kZWZpbmVkIiwiaSIsInNoaXAiLCJjb29yZCIsInB1c2giLCJyZW1vdmVBbGxTaGlwIiwicmVtb3ZlU2hpcCIsInNoaXBMZW5ndGgiLCJzaGlwSW5kZXgiLCJmaW5kSW5kZXgiLCJ0aGVTaGlwIiwiYSIsImIiLCJzcGxpY2UiLCJjcmVhdGVHaG9zdFNoaXAiLCJyb3RhdGVTaGlwIiwibmV3RGlyIiwiY3JlYXRlQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJncmlkVGVtcGxhdGVSb3dzIiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImNsYXNzTGlzdCIsImFkZCIsImRhdGFzZXQiLCJnaG9zdFNoaXAiLCJhcHBlbmRDaGlsZCIsIm1vdmVDdXJzb3IiLCJldmVudCIsInBhZ2VZIiwicGFnZVgiLCJzY3JvbGxMZWZ0Iiwid2luZG93Iiwic2Nyb2xsWCIsImRvY3VtZW50RWxlbWVudCIsImJvZHkiLCJwYXJlbnROb2RlIiwic2Nyb2xsVG9wIiwic2Nyb2xsWSIsImxlZnQiLCJ0b3AiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlR2hvc3RTaGlwIiwicXVlcnlTZWxlY3RvciIsInJlbW92ZSIsInJlY2VpdmVBdHRhY2siLCJoaXQiLCJldmVyeSIsImlzU3VuayIsIlBsYXllciIsImlzQ29tcHV0ZXIiLCJjb21wdXRlciIsInNvbWUiLCJjb21ibyIsImdldFJhbmRvbVBvcyIsImdldFJhbmRvbURpcmVjdGlvbiIsImRpcmVjdGlvbnMiLCJ2YWxpZERpcmVjdGlvbnMiLCJmaWx0ZXIiLCJuZXdYIiwibmV3WSIsImlzVmFsaWQiLCJyYW5kb21JbmRleCIsIm5ld1BvcyIsImJlZW5IaXQiLCJzdW5rIiwiU2NyZWVuQ29udHJvbGxlciIsInBsYXllcjIiLCJnYW1lIiwicGxheWVyMUJvYXJkRGl2IiwicGxheWVyMkJvYXJkRGl2IiwibWVzc2FnZURpdjEiLCJtZXNzYWdlRGl2MiIsInBsYXllcjFCb2FyZCIsInBsYXllcjJCb2FyZCIsInJhbmRvbVBsYWNlQnRuIiwic3RhcnRCdG4iLCJyZXN0YXJ0QnRuIiwiY29tUmFkaW8iLCJwMlJhZGlvIiwiZGlzYWJsZWQiLCJ1cGRhdGVCb2FyZCIsInRleHRDb250ZW50Iiwicm93Iiwicm93SW5kZXgiLCJjZWxsIiwiY29sdW1uSW5kZXgiLCJjZWxsQnV0dG9uIiwiY29sdW1uIiwiTnVtYmVyIiwiYnV0dG9uczEiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYnV0dG9uIiwiYnV0dG9uczIiLCJjb21BdXRvTW92ZXMiLCJoaWRlQm9hcmQiLCJwMUJ0bnMiLCJwMkJ0bnMiLCJidG4iLCJib2FyZENsaWNrSGFuZGxlciIsImUiLCJzZWxlY3RlZFJvdyIsInRhcmdldCIsInNlbGVjdGVkQ29sdW1uIiwicmVzdHJpY3RQMiIsInJlc3RyaWN0UDEiLCJzZXRUaW1lb3V0Iiwic2V0dGluZ0JvYXJkIiwiaXNDb20iLCJjaGVja2VkIiwiY3VycmVudFBsYXllciIsInVwZGF0ZVNldHRpbmdCb2FyZCIsInJlc2V0U3RhcnRCdXR0b25FdmVudCIsInBhcnNlSW50IiwibmV3U3RhcnRCdG4iLCJjbG9uZU5vZGUiLCJyZXBsYWNlV2l0aCIsInN3aXRjaFNldHRpbmdCb2FyZCJdLCJzb3VyY2VSb290IjoiIn0=