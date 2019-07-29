/*  Fractal calculator
*  from z = x + yi
*  (yi)^2 gives y^2
*/
const complexes = [
    (x, y, px, py) => [x * x - y * y + 1.63 * px, (y * x) * 2.5 + 1.63 * Math.abs(py)],
    (x, y, px, py) => [x * x - y * y + x, (y * x) * 2.0 + y],
    (x, y, px, py) => [x * x + y * y - x, -(y * x) * 2.0 - y],
    (x, y, px, py) => [x * x - y * y - x, -(y * x) * 2.0 - y],
    (x, y, px, py) => [x * x - y * y - x, (y * x) * 2.0 - y],
    (x, y, px, py) => [x * x - y * y + x, -(y * x) * 2.0 + y],
    (x, y, px, py) => [x * x - y * y + x, -(y + x) * 2.0 + y],
    (x, y, px, py) => [x * x - y * y + px, -(y + x) * 2.0 + py],
    (x, y, px, py) => [x * x - y * y - x, -(y + x) * 2.0 - y],
    (x, y, px, py) => [x * x + y * y + px, -Math.hypot(x, y) + py],
]

export const getXY = (x, y, maxLvl = 255) => {
    let [zx, zy] = [x, y];
    for (let lvl = 0; lvl < maxLvl; lvl++)
        if (zx > 2.0 || zx < -2.0) return lvl
        else [zx, zy] = comPow(zx, zy, x, y)
    return maxLvl
}

export const moreGetXY = (x, y, maxLvl = 255) => {
    let [zx, zy] = [x, y];
    for (let lvl = 0; lvl < maxLvl; lvl++)
        if (zx > 2.0 || zx < -2.0) return { zx, zy, lvl }
        else [zx, zy] = comPow(zx, zy, x, y)
    return { x, y, zx, zy, maxLvl }
}

export const useComplex = n => {
    if (complexes[n]) return comPow = complexes[n]
    else return false
}

let comPow = complexes[0]