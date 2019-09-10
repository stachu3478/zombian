import { data } from '../data/tutorial'
import './style.scss'

/**
 * Class that is used to guide native players
 */
class Tutorial {
    /**
     * Creates new instance of tutorial
     * @param {EventListener} listener - event list
     * @param {HTMLElement} tutorialHtmlElement - HTML element holding structure needed to store title and desciption of tasks
     * @param {HTMLElement} tutorialMenu - HTML element holding structure needed to manipulate window in mobile
     * @param {Number} startingProgress - The initial {@link Tutorial#progress} that can be used to restore from localStorage object
     */
    constructor (listener, tutorialHtmlElement, tutorialMenu, startingProgress = 0) {
        /** Number of tutorial point that is being challenged */
        this.progress = startingProgress
        /** HTML root element of the class */
        this.element = tutorialHtmlElement
        this.tutorialMenu = tutorialMenu
        /** Listener that receives triggers to check for complexion of challenges */
        this.listener = listener
        /** Tells that all challenges are complete */
        this.done = false
        /** Tells that the tutorial is active and checks for challenge complexion */
        this.enabled = true
        /** Tells that the root element should be minimized */
        this.minimized = false

        this.handleClose = this.handleClose.bind(this)
        this.handleMinimize = this.handleMinimize.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
        this.handleRestore = this.handleRestore.bind(this)
        this.handleTutorialClick = this.handleTutorialClick.bind(this)
        this.handleTutorialWindowClose = this.handleTutorialWindowClose.bind(this)

        if (navigator.maxTouchPoints === 0) {
            this.element.children[2].children[0].addEventListener('click', this.handleClose)
            this.element.children[2].children[1].addEventListener('click', this.handleMinimize)
        } else {
            this.element.addEventListener('click', this.handleTutorialClick)
            tutorialMenu.children[2].addEventListener('click', this.handleClose)
            tutorialMenu.children[3].addEventListener('click', this.handleMinimize)
            tutorialMenu.children[4].addEventListener('click', this.handleTutorialWindowClose)
        }

        this.nextObjective()
    }

    /**
     * Builds the current task data and adds listeners
     */
    nextObjective () {
        const current = data[this.progress]
        if (!current) return
        this.element.children[0].innerText = current.name
        this.element.children[1].innerText = current.desc
        this.solveFunction = (evt => {
            if (current.func(evt)) {
                this.listener.off(current.event, this.solveFunction)
                this.element.classList.add('hidden-fluent')
                this.progress++
                this.nextObjective()
            }
        }).bind(this)
        this.listener.on(current.event, this.solveFunction)
        this.element.classList.remove('hidden-fluent')
    }

    /**
     * Triggers when closing tutorial window
     * hides window and stops listening
     * @param {MouseEvent | TouchEvent} evt
     */
    handleClose (evt) {
        if (!this.enabled || this.done) return
        this.enabled = false
        this.listener.off(data[this.progress].event, this.solveFunction)
        this.element.classList.add('hidden-fluent')
        if (evt instanceof TouchEvent) this.handleTutorialWindowClose()
        evt.preventDefault()
    }

    /**
     * Triggers when opening tutorial window back
     * resumes listening
     * @param {MouseEvent | TouchEvent} evt
     */
    handleOpen (evt) {
        if (this.enabled || this.done) return
        this.enabled = true
        this.listener.on(data[this.progress].event, this.solveFunction)
        this.element.classList.remove('hidden-fluent')
        evt.preventDefault()
    }

    /**
     * Triggers when minimizing tutorial window
     * @param {MouseEvent | TouchEvent} evt
     */
    handleMinimize (evt) {
        if (this.minimized || this.done || !this.enabled) return
        this.minimized = true
        this.element.classList.add('minimized')
        this.element.addEventListener('click', this.handleRestore)
        if (evt instanceof TouchEvent) this.handleTutorialWindowClose()
        evt.preventDefault()
    }

    /**
     * Restores window of minimized state
     * @param {MouseEvent | TouchEvent} evt
     */
    handleRestore (evt) {
        if (!this.minimized || this.done || !this.enabled) return
        this.minimized = false
        this.element.classList.remove('minimized')
        this.element.removeEventListener('click', this.handleRestore)
        evt.preventDefault()
    }

    /**
     * Shows tutorial menu in mobile devices
     * @param {MouseEvent | TouchEvent} evt
     */
    handleTutorialClick (evt) {
        if (this.minimized) return
        this.tutorialMenu.classList.remove('hidden')
        this.listener.trigger('pause')
        evt.preventDefault()
    }

    handleTutorialWindowClose (evt) {
        this.tutorialMenu.classList.add('hidden')
        this.listener.trigger('pause')
    }
}

export default Tutorial