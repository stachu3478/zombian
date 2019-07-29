import { pressed } from './utils/iKey'
import Game from './classes/Game';

import { load } from './components/images'

export default function App () {
    const canvas = document.getElementsByTagName('canvas')[0]

    const game = new Game(canvas, pressed)

    load().then(() => {
        game.start()
    })
}