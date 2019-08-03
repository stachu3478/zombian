class ElementSwitcher { // quick switch between elements show one, hide others
    constructor (elements, hiddenClass = 'hidden', mode = 'hide', unmountTimeout = 10) {
        this.current = -1;
        this.elements = [...elements];
        this.parentElements = this.elements.map(e => e.parentElement)
        this.hiddenClass = hiddenClass
        this.mode = mode
        this.unmountTimeout = unmountTimeout

        this.hideAndShow = this.hideAndShow.bind(this)
        this.mountAndUnmount = this.mountAndUnmount.bind(this)
        this.loopElements = this.loopElements.bind(this)

        this.switchTo(0);
    }

    switchTo (n) {
        switch (this.mode) {
            case 'both': setTimeout(() => this.loopElements(n, this.mountAndUnmount), this.unmountTimeout);
            case 'hide': this.loopElements(n, this.hideAndShow); break
            case 'unmount': this.loopElements(n, this.mountAndUnmount); break
        }
    }

    hideAndShow (enabled, element) {
        if (enabled) element.classList.remove(this.hiddenClass) // the style class defines the hidden element
        else element.classList.add(this.hiddenClass)
    }

    mountAndUnmount (enabled, element, index) {
        if (enabled) this.parentElements[index].appendChild(element)
        else element.parentElement.removeChild(element)
    }

    loopElements (n, callback) {
        if (this.current !== n) {
            this.elements.forEach((v, k) => {
                callback(k === n, v, k)
            });
            this.current = n;
        }
    }
}

export default ElementSwitcher