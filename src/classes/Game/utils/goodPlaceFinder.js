export const find = ({ render, camera }) => {
    let found = false
    let xPos = camera.x >> 4
    let yPos = camera.y >> 4
    let xDir = 1
    let yDir = 0
    let len = 0
    let cur = 0
    while (!found) {
        xPos += xDir * 4
        yPos += yDir * 4
        cur += 1
        if (cur >= len) {
            len += 0.5
            cur = 0
            const tmp = xDir
            xDir = -yDir
            yDir = tmp
            console.log('Scanning', xPos, yPos)
        }
        if (render(70)) {
            camera.x = xPos * 32
            camera.y = yPos * 32
            found = true
        }
    }
}