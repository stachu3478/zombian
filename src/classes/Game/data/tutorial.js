function TutorialPoint (name, desc, func, event) {
    this.name = name
    this.desc = typeof desc == 'string' ? desc : desc()
    this.func = func
    this.event = event
}

const isMobile = navigator.maxTouchPoints > 0
const always = () => true

export const data = [
    ['Movement', isMobile ? `Use pad on the left to move.` : `Use arrow keys to move.`, always, 'movement'],
    ['Aim', isMobile ? `Use pad on the right to aim around.` : `Use your mouse to aim around.`, always, 'aim'],
    ['Attack', isMobile ? `Tap on pad on the right to attack or swing items.` : `Left click mouse to attack.`, always, 'attack'],
    ['Defense', `Kill zombies that are coming to you. Avoid their contact.`, always, 'kill'],
    ['Rest', isMobile ? `You can press pause button on the left to pause the game.` : `You can press "P" to pause the game.`, always, 'pause'],
    ['Finally', `Survive as long as you can. Have fun!`, always, 'attack'],
].map(task => new TutorialPoint(...task))