class Mob {
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
        this.unclaimBlock()

        if (!this.checkPos(this.x + x, this.y + y, true) || !this.loopMyPixels(this.checkPos, this.x + x, this.y + y)) {
            this.claimBlock()
            return false
        }

        this.x += x
        this.y += y
        this.claimBlock()

        this.step += Math.hypot(x, y)

        return true
    }

    checkPos (px, py, isTarget) {
        const block = this.tileMap.getBlock(px, py)
        if (!block || (block.c && isTarget)) {
            console.log('isTarget')
            return false
        }
        if (block.c) {
            const mob = block.c
            if (Math.abs(mob.x - this.x) < this.squareSize && Math.abs(mob.y - this.y) < this.squareSize) {
                this.knock(mob, 2)
                return false
            }
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
        ctx.lineWidth = 8 // for throusers xdxdxdxdddddddd
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