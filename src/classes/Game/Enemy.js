import Mob from './Mob'
import { zombieImages } from './components/images'

const PI2 = Math.PI * 2

/**
 * Zombie that spawns and attacks the player
 */
class Enemy extends Mob {
    /**
     * Creates new zombie
     * @param {Camera} camera - camera used for scrolling
     * @param {CanvasRenderingContext2D} ctx - context used to render on
     * @param {TileMap} tileMap - map to assign
     * @param {Number} intelligence - The zombie's intelligence {@link Enemy#intelligence}
     */
    constructor (camera, ctx, tileMap, intelligence) {
        super(camera, ctx, tileMap)

        /** Enemy's health */
        this.hp = 100
        /** Tells the entity has already spawned */
        this.spawned = false
        /** Tells the entity has received damage last time, the higher value is the less time is since then */
        this.shock = 0

        /** float(0, 1) values describing its behaviour */
        this.intelligence = intelligence
        /** The inverse of its stupidity */
        this.inv = 1 - this.intelligence
        /** Image to use for rendering the enemy. Different zombie intelligence makes different image. */
        this.image = zombieImages[Math.floor(this.inv * 4)]

        /** Current cos(direction) */
        this.xDir = 0
        /** Current sin(direction) */
        this.yDir = 1

        /** Enemy's target which could be {@link Hero} */
        this.target = null

        this.checkPos = this.checkPos.bind(this)

        this.spawn()
    }

    /** Tries to find a place to spawn, if none, waits */
    spawn () {
        const randomSpawn = (Math.random() * 4) >> 0
        switch (randomSpawn) {
            case 0: {
                this.x = -600
                this.y = Math.random() * 1260 - 620
            }break;
            case 1: {
                this.x = 600
                this.y = Math.random() * 1260 - 620
            }break;
            case 2: {
                this.y = -620
                this.x = Math.random() * 1260 - 620
            }break;
            default: {
                this.y = 620
                this.x = Math.random() * 1260 - 620
            }break;
        }
        if (this.checkPos(this.x, this.y, true)) this.claimBlock()
        else return false
        this.spawned = true
        this.changeDir()
        return true
    }

    /** The standard time processing function of entity */
    tick () {
        if (!this.spawned) return this.spawn()
        if (Math.hypot(this.x - this.targetX, this.y - this.targetY) <= 8) this.changeDir()
        if (this.currentDir !== this.targetDir) {
            let dir = this.currentDir - this.targetDir
            if (dir > 0.125) {
                this.currentDir -= 0.125
            } else if (dir < -0.125) {
                this.currentDir += 0.125
            } else this.currentDir = this.targetDir
            this.xDir = Math.cos(this.currentDir)
            this.yDir = Math.sin(this.currentDir)
        } else if (!this.moveBy(this.xDir, this.yDir)) this.changeDir()

        this.render()
    }

    /** Let's it looking for {@link Hero} and changing direction */
    changeDir () {
        const rx = Math.random() * 640 - 320
        const ry = Math.random() * 640 - 320
        if (!this.target) {
            this.searchForTarget()
            this.targetX = this.x + rx
            this.targetY = this.y + ry
        } else if (this.hp === 100 || this.intelligence < 0.375) {
            this.targetX = (this.x + rx) * this.inv + this.target.x * this.intelligence
            this.targetY = (this.y + ry) * this.inv + this.target.y * this.intelligence
        } else {
            this.targetX = this.target.x
            this.targetY = this.target.y
        }
        this.aim()
    }

    /**
     * Sets it's target to specified direction
     * @param {Number} x - X target position 
     * @param {Number} y - Y target position
     */
    aim (x = this.targetX, y = this.targetY) {
        this.targetX = x
        this.targetY = y
        this.targetDir = Math.atan2(y - this.y, x - this.x)
        this.currentDir = Math.atan2(this.yDir, this.xDir)
        let dir = this.currentDir - this.targetDir
        while (dir > Math.PI) {
            dir -= PI2
            this.currentDir -= PI2
        }
        while (dir < -Math.PI) {
            dir += PI2
            this.currentDir += PI2
        }
    }

    /** Downloads random block around and checks for {@link Hero}'s existence */
    searchForTarget () {
        const rx = this.x + Math.random() * 320 - 160
        const ry = this.y + Math.random() * 320 - 160
        const block = this.tileMap.getBlock(rx, ry)
        if (block && block.c && block.c.keyboard) {
            this.target = block.c
        }
    }

    /** Renders an entity */
    render () {
        const {ctx} = this
        ctx.save()
        ctx.translate(this.x - this.camera.x, this.y - this.camera.y)
        ctx.rotate(Math.atan2(this.yDir, this.xDir))
        this.renderBottom()
        ctx.drawImage(this.image, -12, -12)
        ctx.restore()

        if (this.shock > 0) {
            this.shock--
            ctx.save()
            ctx.translate(this.x - this.camera.x, this.y - this.camera.y)
            ctx.lineCap = 'round'
            if (this.shock < 33) ctx.globalAlpha = this.shock / 33
            ctx.lineWidth = 7
            ctx.beginPath()
            ctx.strokeStyle = 'black'
            ctx.moveTo(-12, -9)
            ctx.lineTo(+12, -9)
            ctx.stroke()

            ctx.lineWidth = 5
            ctx.beginPath()
            ctx.strokeStyle = 'red'
            ctx.moveTo(-12, -9)
            if (this.hp < 50) ctx.lineCap = 'butt'
            ctx.lineTo(-12 + this.hp * 0.24, -9)
            ctx.stroke()
            ctx.restore()
        }
        // this.ctx.fillStyle = "red"
        // this.ctx.fillRect(this.x - 12 - this.camera.x, this.y - 12 - this.camera.y, 24, 24)
    }

    /** Function that removes itself from the {@link Game} */
    die () {

    }

    /**
     * Checks if the target tile is occupied and available to claim position on
     * @param {Number} px - Pixel X 
     * @param {Number} py - Pixel Y
     * @param {Number} isTarget - stricts the search to have no entity existence on tile
     */
    checkPos (px, py, isTarget) {
        const block = this.tileMap.getBlock(px, py)
        if (!block) {
            return false
        }
        if (block.c) {
            const mob = block.c
            if (this === mob) {return false}
            if (Math.abs(mob.x - this.x) < 24 && Math.abs(mob.y - this.y) < 24) {
                if (mob.keyboard) {
                    mob.deal(10)
                    this.knock(mob, 12)
                } else this.knock(mob, 2)
                return false
            }
            if (isTarget) return false
        }
        return true
    }

    /**
     * Deals damage to entity
     * @param {Number} dmg - amount of damage to deal
     */
    deal (dmg, mob) {
        this.shock = 200
        this.hp -= dmg
        this.target = mob
        if (this.intelligence >= 0.125) this.aim(mob.x, mob.y)
        if (this.hp <= 0) {
            this.die()
            return true
        }
    }
}

export default Enemy