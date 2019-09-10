const images = [
    "water",
    "salt",
    "sand",
    "gravel",
    "dirt",
    "grass",
    "dust",
    "stone",
    "miasma"
]

export const img = {}

images.forEach(v => {
    img[v] = new Image()
    img[v].src = "tiles/" + v + ".png"
})