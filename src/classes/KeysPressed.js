class KeysPressed {
    constructor () {
        document.body.onkeydown = function(evt) {
            this[evt.key] = true
        }
        document.body.onkeyup = function(evt) {
            this[evt.key] = false
        }
    }
}

export default KeysPressed