import { pxToCm } from '../utils/unitConverter'

import EventListener from '../classes/EventListener'

export const pressed = {
    aimDirection: 0
}

export const eventListener = new EventListener()

if (navigator.maxTouchPoints) {
    const noneTouch = {identifier: -1}
    let moveControllerTouch = noneTouch
    let attackControllerTouch = noneTouch
    let pauseTouch = noneTouch
    let outerTouch = noneTouch
    let attackTouchTap = true
    const moveControllerElement = document.getElementsByClassName("move-controller")[0]
    const aimControllerElement = document.getElementsByClassName("aim-controller")[0]
    const pauseControllerElement = document.getElementsByClassName("pause-controller")[0]
    document.body.addEventListener('touchstart', evt => {
        let moveTouch = false
        let attackTouch = false
        let preventDefault = true
        for (let i = 0; i < evt.changedTouches.length; i++) {
            const touch = evt.changedTouches[i]
            switch (touch.target) {
                case moveControllerElement : {
                    if (moveTouch) break
                    moveTouch = true
                    moveControllerTouch = touch
                    pressed.ArrowRight = 0;
                    pressed.ArrowLeft = 0;
                    pressed.ArrowDown = 0;
                    pressed.ArrowUp = 0;
                } break;
                case aimControllerElement : {
                    if (attackTouch) break
                    attackTouch = true
                    attackControllerTouch = touch
                    attackTouchTap = true
                } break;
                case pauseControllerElement : {
                    pauseTouch = touch
                } break;
                default : {
                    outerTouch = touch
                    preventDefault = false
                }
            }
        }
        if (preventDefault) evt.preventDefault()
    }, {
        passive: false
    })
    document.body.addEventListener('touchmove', evt => {
        let preventDefault = true
        for (let i = 0; i < evt.changedTouches.length; i++) {
            const touch = evt.changedTouches[i]
            switch (touch.identifier) {
                case moveControllerTouch.identifier : {
                    const moveX = touch.clientX - moveControllerTouch.clientX, moveY = touch.clientY - moveControllerTouch.clientY
                    const direction = Math.atan2(moveY, moveX)
                    let distance = pxToCm(Math.hypot(moveX, moveY)) * 2
                    if (distance > 1) distance = 1
                    const x = Math.cos(direction) * distance
                    const y = Math.sin(direction) * distance
                    pressed.ArrowRight = 0;
                    pressed.ArrowLeft = 0;
                    pressed.ArrowDown = 0;
                    pressed.ArrowUp = 0;
                    if (x > 0) pressed.ArrowRight = x;
                    else pressed.ArrowLeft = -x;
                    if (y > 0) pressed.ArrowDown = y;
                    else pressed.ArrowUp = -y;
                } break;
                case attackControllerTouch.identifier : {
                    attackTouchTap = false
                    pressed.aimDirection = Math.atan2(touch.clientY - attackControllerTouch.clientY, touch.clientX - attackControllerTouch.clientX)
                } break;
                case pauseTouch.identifier : {
                    pauseTouch = noneTouch
                } break;
                case outerTouch.identifier : preventDefault = false; break
            }
        }
        if (preventDefault) evt.preventDefault()
    }, {
        passive: false
    })
    document.body.addEventListener('touchend', evt => {
        let preventDefault = true
        for (let i = 0; i < evt.changedTouches.length; i++) {
            const touch = evt.changedTouches[i]
            switch (touch.identifier) {
                case moveControllerTouch.identifier : {
                    pressed.ArrowRight = 0;
                    pressed.ArrowLeft = 0;
                    pressed.ArrowDown = 0;
                    pressed.ArrowUp = 0;
                    moveControllerTouch = noneTouch
                }; break;
                case attackControllerTouch.identifier : {
                    pressed.SpaceBar = false
                    attackControllerTouch = noneTouch
                    if (attackTouchTap) pressed.Mouse = true
                }; break;
                case pauseTouch.identifier : {
                    pauseTouch = noneTouch
                    eventListener.trigger('pause')
                } break;
                case outerTouch.identifier : {
                    outerTouch = noneTouch
                    preventDefault = false
                }; break
            }
        }
        if (preventDefault) evt.preventDefault()
    }, {
        passive: false
    })
    document.body.addEventListener('touchcancel', evt => {
        let moveTouch = false
        let attackTouch = false
        for (let i = 0; i < evt.touches.length; i++) {
            const touch = evt.touches[i]
            switch (touch.identifier) {
                case moveControllerTouch.identifier : moveTouch = true; break;
                case attackControllerTouch.identifier : attackTouch = true; break;
            }
        }
        if (!moveTouch) {
            pressed.ArrowRight = 0;
            pressed.ArrowLeft = 0;
            pressed.ArrowDown = 0;
            pressed.ArrowUp = 0;
            moveControllerTouch = noneTouch
        }
        if (!attackTouch) {
            pressed.SpaceBar = false
            attackControllerTouch = noneTouch
        }
    })
} else {
    document.body.addEventListener('keydown', evt => {
        pressed[evt.key] = true
        if (evt.key === 'p') eventListener.trigger('pause')
    })
    document.body.addEventListener('keyup', evt => {
        pressed[evt.key] = false
    })
    document.body.addEventListener('mousemove', evt => {
        pressed.aimX = evt.offsetX
        pressed.aimY = evt.offsetY
    })
    document.body.addEventListener('mousedown', evt => {
        pressed.Mouse = true
    })
}