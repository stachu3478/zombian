/**
 * HTML attributes that will be passed from JSON data to given input element
 */
const safeHtmlAttributes = {
    "type": "type",
    "class": "className",
    "id": "id",
    "name": "name",
    "onclick": "onclick",
    "onkeydown": "onkeydown",
    "onkeyup": "onkeyup",
    "ontouchstart": "ontouchstart",
    "ontouchend": "ontouchend"
}

/**
 * Logical form data structure that is interpreted by {@link FormManager} instance
 */
function LogicalFormData () {
    /** The form title displayed on the top in h3 element */
    this.title = "My form name"
    /** The object containing input element data structure by key => title of the input */
    this.content = {}
}

const getObject = (root, key) => {
    const prop = root[key]
    if (typeof prop == 'object') {
        if (!prop.name) prop.name = key
        return prop
    } else return {name: key}
}

/**
 * Automatically creates flexible forms from
 * logical data structure
 */
class FormManager {
    /**
     * Creates an instance of FormManager
     * @param {LogicalFormData} forms - Object containing {@link LogicalFormData} forms where the key is the name of the form that can be accessed later
     * using {@link FormManager@getForm} by passing the key as first argument
     */
    constructor (forms) {
        this.forms = forms
    }

    /**
     * Creates an HTML structure of the supplied form name
     * @param {String} name - Name of the form passed in the {@link FormManager.constructor}'s data structure
     * @param {Object} data - Object containing default values for the inputs by the sections if these are nested
     */
    getForm (name, data) {
        const form = this.forms[name]
        if (!form) return false

        const rootElement = document.createElement('form')
        rootElement.name = name

        const {
            title = name,
            content
        } = form
        if (title) {
            const element = document.createElement('h3')
            element.innerText = title
            rootElement.appendChild(element)
        }
        if (content.isNested) {
            Object.keys(content).forEach(name => {
                const section = content[name]
                if (typeof section == 'object') {
                    const element = this.loadSection(key, section, data[name])
                    rootElement.appendChild(element)
                }
            })
        } else {
            const section = this.loadSection(name, content, data)
            rootElement.appendChild(section)
        }

        const helperElement = document.createElement('span')
        helperElement.className = 'helper'
        rootElement.appendChild(helperElement)
    }

    loadSection (name, data, values = {}) {
        const rootElement = document.createElement('section')
        rootElement.name = name

        const {
            title = name,
            content
        } = data
        if (title) {
            const element = document.createElement('h3')
            element.innerText = title
            rootElement.appendChild(element)
        }
        Object.keys(content).forEach(key => {
            const input = getObject(content, key)
            const element = document.createElement('input')
            element.value = values[key]
            Object.keys(input).forEach(key => {
                const attribute = input[key]
                const htmlAttribute = safeHtmlAttributes[key]
                if (htmlAttribute) element[htmlAttribute] = attribute
            })
        })
    }
}

export default FormManager