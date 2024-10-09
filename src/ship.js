export default class Ship {
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
