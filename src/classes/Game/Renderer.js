import Camera from './Camera'

import { getXY } from './utils/fractal'
import { img } from './utils/imageImporter'
import { zmod } from './utils/math'

const zoom = 65525
const ZIX = 1 / zoom
let best = 0

class Renderer {
    constructor (camera, canvas, ctx, snapEdge = true) {
        if (snapEdge) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        this.canvas = canvas
        this.camera = camera || new Camera(canvas)
        this.ctx = ctx || canvas.getContext('2d')
        // camera && this.camera.clip(-Infinity, -Infinity)
        // camera && this.camera.clip(Infinity, Infinity)
        this.camera.x = -829952 // Tp to beautiful place :>
        this.camera.y = 225984
    }

    render (fast) {
        const { canvas, ctx } = this
        const x = (this.camera.x - 829952) / 32, y = (this.camera.y + 225984) / 32
        let score = 0
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.restore()
        ctx.translate(zmod(x, 1) * -32, zmod(y, 1) * -32)
        for (let px = Math.floor(x) * ZIX, cx = 0; cx < canvas.width + 32; px += ZIX, cx += 32) {
            for (let py = Math.floor(y) * ZIX, cy = 0; cy < canvas.height + 32; py += ZIX, cy += 32) {
                const value = getXY(px, py, fast)
                if (fast) {
                    if (value == fast - 1) {
                        score++
                        continue;
                    } else {
                        if (score > best) {
                            console.log('beat', score)
                            best = score
                        }
                        return false
                    }
                }
                let image = 'miasma'
                if (value < 66) {
                    image = 'water'
                } else if (value == 67) {
                    image = 'salt'
                } else if (value == 68) {
                    image = 'sand'
                } else if (value == 69) {
                    image = 'gravel'
                } else if (value == 70) {
                    image = 'dirt'
                } else if (value == 71) {
                    image = 'grass'
                } else if (value < 100) {
                    image = 'dust'
                } else if (value < 256) {
                    image = 'stone'
                }
                ctx.drawImage(img[image], cx, cy)
            }
        }
        ctx.translate(zmod(x, 1) * 32, zmod(y, 1) * 32)
        return true
    }
}

export default Renderer