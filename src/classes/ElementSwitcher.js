class ElementSwitcher { // quick switch between elements show one, hide others
    constructor (elements, hiddenClass) {
        this.current = -1;
        this.elements = [...elements];
        this.hiddenClass = hiddenClass || 'hidden'

        this.switchTo(0);
    }

    switchTo (n) {
        if (this.current !== n) {
            this.elements.forEach((v, k) => {
                if (k === n) v.classList.remove(this.hiddenClass) // the style class defines the hidden element
                else v.classList.add(this.hiddenClass)
            });
            this.current = n;
        }
    }
}

export default ElementSwitcher