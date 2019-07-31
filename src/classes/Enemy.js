import Mob from './Mob'
import { zombieImages } from '../components/images'

const PI2 = Math.PI * 2

class Enemy extends Mob {
    constructor (camera, ctx, tileMap, intelligence) {
        super(camera, ctx, tileMap)

        this.hp = 100
        this.spawned = false
        // this.kills = 0

        this.intelligence = intelligence
        this.inv = 1 - this.intelligence
        this.image = zombieImages[Math.floor(this.inv * 4)]

        this.xDir = 0
        this.yDir = 1

        this.checkPos = this.checkPos.bind(this)

        this.spawn()
    }

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

    changeDir () {
        const rx = Math.random() * 640 - 320
        const ry = Math.random() * 640 - 320
        if (!this.target) {
            this.searchForTarget()
            this.targetX = rx
            this.targetY = ry
        } else {
            this.targetX = rx * this.inv + this.target.x * this.intelligence
            this.targetY = ry * this.inv + this.target.y * this.intelligence
        }
        this.aim(this.targetX, this.targetY)
    }

    aim (x = this.targetX, y = this.targetY) {
        this.targetX = x
        this.targetY = y
        this.targetDir = Math.atan2(y - this.y, x - this.x)
        this.currentDir = Math.atan2(this.yDir, this.xDir)
        let dir = this.currentDir - this.targetDir
        while (dir > Math.PI) {
            dir -= PI2
            this.targetDir -= PI2
        }
        while (dir < -Math.PI) {
            dir += PI2
            this.targetDir += PI2
        }
    }

    searchForTarget () {
        const rx = this.x + Math.random() * 320 - 160
        const ry = this.y + Math.random() * 320 - 160
        const block = this.tileMap.getBlock(rx, ry)
        if (block && block.c && block.c.keyboard) {
            this.target = block.c
        }
    }

    render () {
        this.ctx.save()
        this.ctx.translate(this.x - this.camera.x, this.y - this.camera.y)
        this.ctx.rotate(Math.atan2(this.yDir, this.xDir))
        this.renderBottom()
        this.ctx.drawImage(this.image, -12, -12)
        this.ctx.restore()
        // this.ctx.fillStyle = "red"
        // this.ctx.fillRect(this.x - 12 - this.camera.x, this.y - 12 - this.camera.y, 24, 24)
    }

    die () {

    }

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
}

export default Enemy