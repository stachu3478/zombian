const element = document.getElementsByClassName('move-controller')[0]
export const pxToCm = px => px / (element.offsetWidth >> 1)
export const cmToPx = cm => (element.offsetWidth >> 1) / cm