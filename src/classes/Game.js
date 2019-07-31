import Camera from "./Camera";
import Hero from "./Hero"
import Enemy from "./Enemy"
import Renderer from "./Renderer"
import TileMap from "./TileMap"
import './style.css'

import { pressed } from '../utils/iKey'
import { load } from '../components/images'

class Game {
    constructor (canvas) {
        this.canvas = canvas
        this.camera = new Camera(canvas, 0, 0, -640, 640, -640, 640)
        this.keyboard = pressed
        this.ctx = canvas.getContext('2d')
        this.renderer = new Renderer(this.camera, this.canvas, this.ctx)
        this.tileMap = new TileMap()
        this.hero = new Hero(this.keyboard, this.camera, this.ctx, this.tileMap)

        this.paused = false

        this.enemies = new Set()
        this.spawnedEnemies = 1
        this.gameTime = 1
    }

    ready () {
        return load()
    }

    start () {
        this.spawnEnemy()
        this.wave()
        this.loop = setInterval(() => {
            this.tick()
        }, 30)
    }
    
    tick () {
        if (this.keyboard.p) {
            this.keyboard.p = false
            this.paused = !this.paused
            if (this.paused) {
                this.ctx.fillStyle = "rgba(0,0,0,0.7)"
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
                this.ctx.fillStyle = "white"
                this.ctx.textAlign = "center"
                this.ctx.font = "2cm Consolas"
                this.ctx.fillText("Paused", this.canvas.width >> 1, this.canvas.height >> 1)
                this.ctx.strokeText("Paused", this.canvas.width >> 1, this.canvas.height >> 1)
            }
        }
        if (this.paused) return
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
            enemy.unclaimBlock()
            this.enemies.delete(enemy)
        }
    }

    wave () {
        const nextEnemyTime = (60000 + this.spawnedEnemies) / (this.spawnedEnemies)
        console.log('Next enemy will appear in ', nextEnemyTime >> 10, ' seconds')
        setTimeout(() => {
            this.spawnEnemy()
            this.gameTime += nextEnemyTime
            this.spawnedEnemies++
            if (this.hero.alive) this.wave()
        }, nextEnemyTime)
    }
}

export default Game