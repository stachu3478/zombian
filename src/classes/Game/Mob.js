class Mob {
    /**
     * Creates a living entity.
     * @param {import('./Camera').default} camera - camera to use
     * @param {CanvasRenderingContext2D} ctx - canvas context to render on 
     * @param {import('./TileMap').default} tileMap - tile map to use for binding position and collision detection
     */
    constructor (camera, ctx, tileMap) {
        this.camera = camera
        this.ctx = ctx
        this.tileMap = tileMap
        this.x = 0
        this.y = 0

        this.checkPos = this.checkPos.bind(this)

        this.squareSize = 24

        this.step = 0
    }

    moveBy (x, y) {
        const nX = this.x + x, nY = this.y + y
        const blockReclaim = this.tileMap.isSameBlock(this.x, this.y, nX, nY)
        if (blockReclaim) {
            this.unclaimBlock()
            if (!this.checkPos(nX, nY, true) || !this.loopMyPixels(this.checkPos, nX, nY)) {
                this.claimBlock()
                return false
            }
        } else this.loopMyPixels(this.checkPos, nX, nY)

        this.x = nX
        this.y = nY
        if (blockReclaim) this.claimBlock()

        this.step += Math.hypot(x, y)

        return true
    }

    /**
     * Checks for overlapping with other entity
     * @param {Number} px - X coordinate to check
     * @param {Number} py - Y coordinate to check
     * @param {Boolean} isTarget - Specifies the function to treat
     * checking block as it is claimed by the checker
     * @returns {Boolean} - Boolean determining the existence of collision
     */
    checkPos (px, py, isTarget) {
        const block = this.tileMap.getBlock(px, py)
        if (!block) {
            return false
        }
        if (block.c) {
            const mob = block.c
            if (this === mob) return true
            if (Math.abs(mob.x - this.x) < this.squareSize && Math.abs(mob.y - this.y) < this.squareSize) {
                this.knock(mob, 2)
                return false
            }
            if (isTarget) return false
        }
        return true
    }

    unclaimBlock (px = this.x, py = this.y) {
        this.tileMap.setBlock(px, py, {c: false})
        return true
    }

    claimBlock (px = this.x, py = this.y) {
        this.tileMap.setBlock(px, py, {c: this})
        return true
    }

    loopMyPixels (callback, x = this.x, y = this.y) {
        for (let mx = -32; mx <= 32; mx += 32)
        for (let my = -32; my <= 32; my += 32)
        if (!callback(x + mx, y + my)) return false
        return true
    }

    knock (mob, power) {
        const direction = Math.atan2(mob.y - this.y, mob.x - this.x)
        mob.moveBy(Math.cos(direction) * power, Math.sin(direction) * power)
    }

    renderBottom () {
        const stepProgress = this.step % 48
        const {ctx} = this
        ctx.lineWidth = 8 // for trousers xdxdxdxdddddddd
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'navy'
        ctx.beginPath()
        ctx.moveTo(0, -4)
        ctx.lineTo(stepProgress < 24 ? 12 - stepProgress : -36 + stepProgress , -4)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, 4)
        ctx.lineTo(stepProgress < 24 ? -12 + stepProgress : 36 - stepProgress , 4)
        ctx.stroke()
    }
}

export default Mob