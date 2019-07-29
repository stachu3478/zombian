const offset = 640
const tileSize = 32
class TileMap {
    constructor (props) {
        this.sizeX = 40
        this.sizeY = 40
        this.map = new Array(40 * 40).fill({})
    }

    getBlock (x, y) {
        const tx = ((x + offset) / tileSize) << 0, ty = ((y + offset) / tileSize) << 0
        if (
            tx > -1 && tx < 41
            && ty > -1 && ty < 41
        ) return this.map[tx * 40 + ty]
    }

    setBlock (x, y, data) {
        const tx = ((x + offset) / tileSize) << 0, ty = ((y + offset) / tileSize) << 0
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
}

export default TileMap