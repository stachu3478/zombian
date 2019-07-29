const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
export const convertToPng = img => {
    canvas.width = img.width
    canvas.height = img.height
    ctx.clearRect(0, 0, img.width, img.height)
    ctx.drawImage(img, 0, 0)
    const png = new Image()
    png.src = canvas.toDataURL()
    return png
}