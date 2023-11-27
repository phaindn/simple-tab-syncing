class BaseObject {
    /**
     * @type number
     */
    width;
    /**
     * @type number
     */
    height;
    /**
     * @type number
     */
    x;
    /**
     * @type number
     */
    y;
    /**
     * @type HTMLImageElement
     */
    #image;

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {string} imageSourcePath 
     */
    constructor(width, height, imageSourcePath) {
        this.width = width;
        this.height = height;
        this.#image = new Image(width, height);
        this.#image.src = imageSourcePath;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     */
    drawTo(ctx, x, y) {
        this.x = x;
        this.y = y;
        ctx.drawImage(this.#image, x, y, this.width, this.height);
    }
}

class Shooter extends BaseObject {
    
}

class Tower extends BaseObject {
    /**
     * @type Shooter
     */
    gun;
    constructor() {
        super(120, 120, '/assets/Tower.png');
    }

    /**
     * @param {number} degree 
     */
    rotate(degree) {
    }

    /**
     * @param {BaseObject} gun 
     * @returns 
     */
    attach(gun) {
        if (!gun) {
            return;
        }
        this.gun = gun;
    }
}

