import Camera from "./Camera";
import Hero from "./Hero"
import Enemy from "./Enemy"
import Renderer from "./Renderer"
import TileMap from "./TileMap"
import Tutorial from "./Tutorial/index.js"
import './style.css'

import { pressed, eventListener } from './utils/iKey'
import { load } from './components/images'

class Game {
    constructor (canvas) {
        this.canvas = canvas
        this.camera = new Camera(canvas, 0, 0, -640, 640, -640, 640)
        this.keyboard = pressed
        this.ctx = canvas.getContext('2d')
        this.renderer = new Renderer(this.camera, this.canvas, this.ctx)
        this.tileMap = new TileMap()
        this.hero = new Hero(this.keyboard, this.camera, this.ctx, this.tileMap)
        this.tutorial = new Tutorial(eventListener, document.getElementsByClassName('tutorial')[0], document.getElementsByClassName('tutorial-menu')[0])

        this.paused = false
        this.started = false

        this.enemies = new Set()
        this.spawnedEnemies = 0
        this.nextEnemyTime = 0
        this.gameTime = 1

        this.wave = this.wave.bind(this)
    }

    ready () {
        return load()
    }

    pause () {
        if (this.paused) return
        this.paused = true
        this.pauseTime = Date.now()
        clearInterval(this.loop)
        clearTimeout(this.nextEnemyTimeout)

        this.ctx.fillStyle = "rgba(0,0,0,0.7)"
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.fillStyle = "white"
        this.ctx.textAlign = "center"
        this.ctx.font = "2cm Consolas"
        this.ctx.fillText("Paused", this.canvas.width >> 1, this.canvas.height >> 1)
        this.ctx.strokeText("Paused", this.canvas.width >> 1, this.canvas.height >> 1)
    }

    resume () {
        if (!this.paused) return
        this.paused = false
        this.loop = setInterval(() => {
            this.tick()
        }, 30)
        this.nextEnemyTimeout = setTimeout(this.wave, this.nextEnemyTime - this.pauseTime + this.nextEnemyTimestamp)
    }

    start () {
        if (this.started) return
        this.started = true
        this.wave()
        this.loop = setInterval(() => {
            this.tick()
        }, 30)

        eventListener.on('pause', () => {
            if (this.paused) this.resume()
            else this.pause()
        })
    }
    
    tick () {
        this.renderer.render()
        for (let enemy of this.enemies.values()) {
            enemy.tick()
        }
        return this.hero.tick()
    }

    spawnEnemy () {
        const enemy = new Enemy(this.camera, this.ctx, this.tileMap, Math.random())
        this.enemies.add(enemy)
        enemy.die = () => {
            eventListener.trigger('kill')
            enemy.unclaimBlock()
            this.enemies.delete(enemy)
        }
    }

    wave () {
        this.spawnEnemy()
        this.gameTime += this.nextEnemyTime
        this.spawnedEnemies++
        this.nextEnemyTime = (60000 + this.spawnedEnemies) / (this.spawnedEnemies)
        console.log('Next enemy will appear in ', this.nextEnemyTime >> 10, ' seconds')
        this.nextEnemyTimestamp = Date.now()
        if (this.hero.alive) this.nextEnemyTimeout = setTimeout(this.wave, this.nextEnemyTime)
    }
}

export default Game