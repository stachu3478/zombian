import Mob from './Mob'

const heroImage = new Image(24, 24)
heroImage.src = 'mob/hero.svg'
const zombieImage = new Image(24, 24)
zombieImage.src = 'mob/zombie1.svg'

class Hero extends Mob {
    constructor (keyboard, camera, ctx, tileMap) {
        super(camera, ctx, tileMap)

        this.hp = 100
        this.kills = 0
        this.reloaded = true

        this.keyboard = keyboard

        this.alive = true

        this.xDir = 0
        this.yDir = 1

        this.hpOut = document.getElementById('hero-hp')
        this.killsOut = document.getElementById('hero-kills')
        this.reloadOut = document.getElementById('hero-reload')

        this.checkPos = this.checkPos.bind(this)
        this.claimBlock()
    }

    tick () {
        const {ArrowRight = 0, ArrowLeft = 0, ArrowUp = 0, ArrowDown = 0, aimDirection, aimX = 0, aimY = 0} = this.keyboard

        if (this.alive) {
            const dir = aimDirection || Math.atan2(-this.y + this.camera.y + aimY, -this.x + this.camera.x + aimX)
            this.xDir = Math.cos(dir)
            this.yDir = Math.sin(dir)

            const moveX = (ArrowRight - ArrowLeft)
            const moveY = (ArrowDown - ArrowUp)
            if (moveX || moveY) {
                // const dir = Math.atan2(moveY, moveX)
                this.moveBy(moveX * Math.abs(moveX * 3 + this.xDir), moveY * Math.abs(moveY * 3 + this.yDir))
            }

            if (this.keyboard.Mouse) {
                this.attack()
                this.keyboard.Mouse = false
            }
        }

        this.camera.scrollTo(this.x, this.y, true)

        this.render()
    }

    render () {

        this.ctx.save()
        this.ctx.translate(this.x - this.camera.x, this.y - this.camera.y)
        this.ctx.rotate(Math.atan2(this.yDir, this.xDir))
        this.renderBottom()
        this.ctx.drawImage(this.alive ? heroImage : zombieImage, -12, -12)
        // this.ctx.fillStyle = this.alive ? "pink" : "green"
        // this.ctx.fillRect(this.x - 12 - this.camera.x, this.y - 12 - this.camera.y, 24, 24)
        this.ctx.restore()
    }

    attack () {
        if (!this.reloaded) return false
        const ax = this.x + this.xDir * 32
        const ay = this.y + this.yDir * 32
        this.ctx.fillStyle = "yellow"
        this.ctx.fillRect(ax - 8 - this.camera.x, ay - 8 - this.camera.y, 16, 16)
        this.reloaded = false
        this.reloadOut.innerText = "Reloading..."
        setTimeout(() => {
            this.reloaded = true
            if (this.alive) this.reloadOut.innerText = "Ready"
        }, 400)

        for (let mx = -8; mx <= 8; mx += 16)
        for (let my = -8; my <= 8; my += 16) {
            const block = this.tileMap.getBlock(ax + mx, ay + my)
            if (block && block.c && block.c.intelligence) {
                const enemy = block.c
                if (enemy.deal(10, this)) {
                    this.kills++
                    this.killsOut.innerText = this.kills
                } else this.knock(enemy, 6)
                return true
            }
        }
        return false
    }

    deal (dmg) {
        if (!this.alive) return false
        this.hp -= dmg
        this.hpOut.innerText = this.hp
        if (this.hp <= 0) {
            this.alive = false
            this.reloadOut.innerText = "Dead"
        }
    }
}

export default Hero