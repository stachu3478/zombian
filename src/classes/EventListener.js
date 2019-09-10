class EventListener {

    constructor () {
        this.events = {};
    }

    on (msg, f) {
        if (!this.events.hasOwnProperty(msg))
            this.events[msg] = [f];
        else
            this.events[msg].push(f);
    }

    off (msg, f) {
        if (this.events.hasOwnProperty(msg)) this.events[msg] = this.events[msg].filter(func => func !== f)
    }

    trigger (msg, evt) {
        if (this.events.hasOwnProperty(msg)) this.events[msg].forEach(f => f(evt));
    }

}

export default EventListener