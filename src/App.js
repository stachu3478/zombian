//import Image from './loader.png'

import ElementSwitcher from './classes/ElementSwitcher'

export default function App () {
    const canvas = document.getElementsByTagName('canvas')[0]
    //const img = new Image()
    //img.src = Image;
    //document.body.appendChild(Image)

    const switcher = new ElementSwitcher(document.getElementsByTagName('main')[0].children, 'hidden-fluent')
    const loadChecker = new ElementSwitcher(document.getElementsByClassName('load-checker')[0].children)
    const loader = document.getElementsByClassName('loader')[0].children[0]
    const progressMessage = document.getElementsByClassName('progress-message')[0]

    document.body.requestFullScreen = document.body.requestFullScreen || document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.msRequestFullScreen

    document.getElementsByTagName('button')[0].addEventListener('click', evt => {
        progressMessage.innerText = "Preparing interface..."
        document.body.requestFullscreen()
        loadChecker.switchTo(1)
        loader.style.width = '33%'
        progressMessage.innerText = "Updating game..."
        import(/* webpackChunkName: "game" */ './classes/Game').then(({default: Game}) => {
            loader.style.width = '66%'
            progressMessage.innerText = "Building assets..."
            const game = new Game(canvas)
            game.ready().then(() => {
                loader.style.width = '100%'
                progressMessage.innerText = "Done!"
                switcher.switchTo(1)
                game.start()
            })
        })
    })
}