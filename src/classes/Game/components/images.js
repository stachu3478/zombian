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

const loadImage = (path, callbackArray, i) => {
    const img = new Image(24, 24)
    maxLoad++
    img.onload = () => {
        if (callbackArray) callbackArray[i] = convertToPng(img)
        imageLoaded()
    }
    img.src = path
    return img
}

/**
 * Loads list of images, for svgs albo converts to png
 * @param {String} name - image base path 
 * @param {Number} range - number after the base path to loop for (starts from 1)
 * @param {String} extension - image extension
 */
const loadImages = (name, range, extension) => {
    const pngs = extension === '.svg' ? new Array(range) : null
    const images = new Array(range).fill(1).map((v, i) => loadImage(name + (i + 1) + extension, pngs, i))
    return pngs || images
}

export const zombieImages = loadImages('mob/zombie', 4, '.svg')

export const load = () => new Promise((resolve) => {
    if (loading === maxLoad && maxLoad !== 0) {
        resolve()
    }
    done = resolve
})