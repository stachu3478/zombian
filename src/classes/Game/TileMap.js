const offset = 640
const tileSize = 32
const tileSizeModifier = Math.round(Math.log2(32))

const getCoord = v => v >> tileSizeModifier

class TileMap {
    constructor (props) {
        this.sizeX = 40
        this.sizeY = 40
        this.map = new Array(40 * 40).fill({})
    }

    getBlock (x, y) {
        const tx = getCoord(x + offset), ty = getCoord(y + offset)
        if (
            tx > -1 && tx < 41
            && ty > -1 && ty < 41
        ) return this.map[tx * 40 + ty]
    }

    setBlock (x, y, data) {
        const tx = getCoord(x + offset), ty = getCoord(y + offset)
        if (
            tx > -1 && tx < 40
            && ty > -1 && ty < 40
        ) {
            const idx = tx * 40 + ty
            if (this.map[idx].c && data.c) {
                console.log(this.map[idx].c, data.c)
                throw new Error('Write to existing entity position')
            }
            this.map[idx] = {...this.map[idx], ...data}
            // Object.keys(data).forEach(k => this.map[idx][k] = data[k])
        }
        return true
    }

    /**
     * Tells the given coordinates are same blocks.
     * @param {Number} x1 - First block x
     * @param {Number} y1 - First block y
     * @param {Number} x2 - Second block x
     * @param {Number} y2 - Second block y
     */
    isSameBlock (x1, y1, x2, y2) {
        return getCoord(x1) === getCoord(x2) && getCoord(y1) === getCoord(y2)
    }
}

export default TileMap