export class UIComponent {
    #el;
    #proxy;

    text;

    constructor(selectorOrElement) {
        if (typeof selectorOrElement == 'string') {
            this.#el = document.querySelector(selectorOrElement);
        } else {
            this.#el = selectorOrElement;
        }

        this.text = '';

        const ctx = this;

        this.#proxy = new Proxy(this, {
            set(target, prop, value) {
                if (prop == 'text') {
                    ctx.#el.innerText = value;
                }
                return Reflect.set(target, prop, value);
            }
        });

        return this.#proxy;
    }
}

export class CanvasComponent extends UIComponent {
    constructor(selectorOrElement) {
        super(selectorOrElement);
    }
}