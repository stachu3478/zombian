//import Image from './loader.png'

import ElementSwitcher from './classes/ElementSwitcher'

function randomRange(min, max) {
    return (min + Math.floor(Math.random() * (max - min))).toString()
}

document.body.requestFullScreen = document.body.requestFullScreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.msRequestFullScreen

document.onselectstart = (e) => e.preventDefault(); // prevent selection of content in document;

class App {
    constructor () {
        this.canvas = document.getElementsByTagName('canvas')[0]
        this.titleElement = document.getElementsByTagName('h1')[0]

        this.switcher = new ElementSwitcher(document.getElementsByTagName('main')[0].children, 'hidden-fluent', 'both', 500)
        this.loadChecker = new ElementSwitcher(document.getElementsByClassName('load-checker')[0].children, 'hidden', 'both')
        this.loader = document.getElementsByClassName('loader')[0].children[0]
        this.progressMessage = document.getElementsByClassName('progress-message')[0]

        this.buttons = document.getElementsByTagName('button')

        this.randomEffects = this.randomEffects.bind(this)
        this.clearEffects = this.clearEffects.bind(this)
        this.blurHandler = this.blurHandler.bind(this)
        this.gameloaded = this.gameloaded.bind(this)
        this.handleStartGame = this.handleStartGame.bind(this)

        if (!navigator.maxTouchPoints) {
            [...document.getElementsByClassName('mobile')].forEach(e => e.parentElement.removeChild(e))
        }

        this.buttons[0].addEventListener('click', this.handleStartGame)

        this.on = false

        this.startMenu()
    }

    handleStartGame () {
        this.progressMessage.innerText = "Preparing interface..."
        document.body.requestFullscreen()
        this.loadChecker.switchTo(2)
        this.loader.style.width = '11vw'
        this.progressMessage.innerText = "Updating game..."
        import(/* webpackChunkName: "game" */ './classes/Game')
        .then(({default: Game}) => this.gameloaded(Game))
        .catch(err => this.progressMessage.innerHTML = `Error loading game. Please inform us about it.<br><i>${err.message}</i>`)
    }

    startMenu () {
        if (this.on) return
        this.on = true
        this.switcher.switchTo(0)
        this.randomEffectsTimeout = setTimeout(this.randomEffects, 10)
    }

    stopMenu () {
        if (!this.on) return
        this.on = false
        this.switcher.switchTo(1)
        clearTimeout(this.randomEffectsTimeout)
    }

    randomEffects () {
        this.titleElement.style.filter = `blur(${randomRange(0, 9)}px) brightness(${Math.random().toString()}) contrast(${randomRange(0, 200)}%) grayscale(${randomRange(0, 100)}%) hue-rotate(${randomRange(-16, 16)}deg) invert(${randomRange(0, 100)}%) opacity(${randomRange(0, 100)}%) saturate(${randomRange(0, 100)}%) sepia(${randomRange(0, 100)}%) drop-shadow(${randomRange(0, 16)}px ${randomRange(0, 16)}px ${randomRange(0, 16)}px white)`
        setTimeout(this.clearEffects, 50)
        this.randomEffectsTimeout = setTimeout(this.randomEffects, randomRange(60, 10000))
    }

    clearEffects () {
        this.titleElement.style.filter = 'none'
    }

    blurHandler () {
        this.game.pause()
        this.startMenu()
        this.loadChecker.switchTo(1)
    }

    gameloaded (Game) {
        this.loader.style.width = '22vw'
        this.progressMessage.innerText = "Building assets..."
        this.game = new Game(this.canvas)

        this.game.ready().then(() => {
            this.loader.style.width = '33vw'
            this.progressMessage.innerText = "Done!"
            this.stopMenu()
            this.game.start()
        })

        this.buttons[1].addEventListener('click', evt => {
            this.progressMessage.innerText = "Resuming..."
            this.game.resume()
            document.body.requestFullscreen()
            this.loadChecker.switchTo(2)
            this.stopMenu()
        })
    
        document.addEventListener('fullscreenchange', evt => { // Fullscreen disability detection
            if (!document.fullscreenElement) this.blurHandler()
        })
    
        document.body.addEventListener('blur', this.blurHandler)
    }
}

export default App