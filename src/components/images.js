import { convertToPng } from '../utils/svgToPng'

let loading = 0
let maxLoad = 0
let done = () => {}
let imageLoaded = () => {
    loading++
    if (loading === maxLoad) {
        done()
    }
}

export const zombieImages = new Array(4).fill(1)
const zombieImagesRaw = new Array(4).fill(1).map((v, i) => {
    const img = new Image(24, 24)
    maxLoad++
    img.onload = () => {
        zombieImages[i] = convertToPng(img)
        imageLoaded()
    }
    img.src = 'mob/zombie' + (i + 1) + '.svg'
    return img
})

export const load = () => new Promise((resolve) => {
    if (loading === maxLoad && maxLoad !== 0) {
        resolve()
    }
    done = resolve
})