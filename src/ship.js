export default class Ship {
    constructor(length) {
        this.length = length;
        this.beenHit = 0;
        this.sunk = false;
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
