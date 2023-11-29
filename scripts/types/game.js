/**
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {number} width 
 * @param {number} height 
 * @param {string} src 
 * @returns {HTMLImageElement}
 */
function loadResouce(width, height, src) {
    const image = new Image(width, height);
    image.src = src;

    return image;
}


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
    _image;

    /**
     * @constant
     * @type {Coordinate}
     */
    ATTACH_POSITION;

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {string} imageSourcePath 
     */
    constructor(width = 0, height = 0, imageSourcePath) {
        this.width = width || 0;
        this.height = height || 0;
        this._image = new Image(width || 0, height || 0);
        if (imageSourcePath) {
            this._image.src = imageSourcePath;
        }
        this.ATTACH_POSITION = {
            x: 0,
            y: 0,
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} x 
     * @param {number} y 
     */
    drawTo(ctx, x, y) {
        this.x = x;
        this.y = y;
        if (this._image.complete) {
            this.draw(ctx);
        } else {
            this._image.onload = () => {
                this.draw(ctx);
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        this.drawAtCenter(ctx);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawAtCenter(ctx) {
        const cw = ctx.canvas.width;
        const ch = ctx.canvas.height;
        ctx.drawImage(this._image, cw/2 - this.ATTACH_POSITION.x, ch/2 - this.ATTACH_POSITION.y, this.width, this.height);
    }
}

export class Tower extends BaseObject {
    /**
     * @type {Shooter}
     */
    gun;

    constructor() {
        const size = 100;
        super(size, size, '/assets/Tower.png');
        this.ATTACH_POSITION = {
            x: size/2,
            y: size/2,
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        super.drawAtCenter(ctx);
        if (this.gun) {
            this.gun.drawTo(ctx);
        }
    }

    /**
     * @param {number} degree 
     */
    rotateGun(radiant) {
        this.gun.angle += radiant;
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

/**
 * @typedef IShooterLevel
 * @property {HTMLImageElement} image
 * @property {number} width
 * @property {number} height
 * @property {number} speed
 * @property {Coordinate} ATTACH_POSITION
 */

/**
 * @implements {IShooterLevel}
 */
export class Shooter extends BaseObject {
    /**
     * @type {IShooterLevel[]}
     * @static
     */
    static LEVELS = [];

    /**
     * @type {number}
     */
    speed;

    /**
     * @type {number}
     */
    angle;

    /**
     * @type {number}
     */
    #level;

    /**
     * @type {Bullet}
     */
    Bullet;

    /**
     * @param {number} angle
     * @param {number} level
     */
    constructor(angle = 0, level = 0) {
        super();
        this.level = level;
        this.angle = angle;
    }

    /**
     * @override
     * @param {number} value
     */
    set level(value) {
        this.#level = value;
        this.speed = this.__proto__.constructor.LEVELS[value].speed;
        this.width = this.__proto__.constructor.LEVELS[value].width;
        this.height = this.__proto__.constructor.LEVELS[value].height;
        this._image = this.__proto__.constructor.LEVELS[value].image;
        this.ATTACH_POSITION = this.__proto__.constructor.LEVELS[value].ATTACH_POSITION;
    }

    get level() {
        return this.#level;
    }

    /**
     * @param {Tower} tower 
     */
    attachTo(tower) {
        tower.attach(this);
    }

    /**
     * @override
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        const cw = ctx.canvas.width;
        const ch = ctx.canvas.height;
        ctx.translate(cw/2, ch/2);
        ctx.rotate(this.angle);
        ctx.translate(-cw/2, -ch/2);
        this.drawAtCenter(ctx);
    }

    shoot() {
        let b = this.#createBullet()
    }

    #createBullet() {
    }
}

export class MachineGunShooter extends Shooter {
    static {
        const src = (level) => `/assets/MG${level}.png`;
        const LEVELS = [
            {
                image: loadResouce(80, 167, src`1`),
                width: 80,
                height: 167,
                speed: 0.5,
                ATTACH_POSITION: {
                    x: 167 * 9.5 / 29,
                    y: 80 / 2 * 3
                }
            },
            {
                image: loadResouce(80, 167, src`2`),
                width: 110,
                height: 167,
                speed: 0.333,
                ATTACH_POSITION: {
                    x: 167 * 9.5 / 29,
                    y: 80 / 2 * 3
                }
            },
            {
                image: loadResouce(80, 167, src`3`),
                width: 80,
                height: 167,
                speed: 0.2,
                ATTACH_POSITION: {
                    x: 167 * 9.5 / 29,
                    y: 80 / 2 * 3
                }
            },
        ];
        this.LEVELS = LEVELS;
    }
}

export class CannonShooter extends Shooter {
    static {
        const src = (level) => `/assets/Cannon${level}.png`;
        const LEVELS = [
            {
                image: loadResouce(80, 167, src`1`),
                width: 80,
                height: 167,
                speed: 0.5,
                ATTACH_POSITION: {
                    x: 120 * 9.5 / 29,
                    y: 80 / 2 * 3
                }
            },
            {
                image: loadResouce(80, 167, src`2`),
                width: 100,
                height: 167,
                speed: 0.333,
                ATTACH_POSITION: {
                    x: 154 * 9.5 / 29,
                    y: 75 / 2 * 3
                }
            },
            {
                image: loadResouce(80, 167, src`3`),
                width: 100,
                height: 167,
                speed: 0.2,
                ATTACH_POSITION: {
                    x: 150 * 9.5 / 29,
                    y: 70 / 2 * 3
                }
            },
        ];
        this.LEVELS = LEVELS;
    }
}

export class MissileLauncherShooter extends Shooter {
    static {
        const src = (level) => `/assets/MissileLauncher${level}.png`;
        const LEVELS = [
            {
                image: loadResouce(80, 167, src`1`),
                width: 80,
                height: 167,
                speed: 0.5,
                ATTACH_POSITION: {
                    x: 120 * 9.5 / 29,
                    y: 77 / 2 * 3
                }
            },
            {
                image: loadResouce(80, 167, src`2`),
                width: 110,
                height: 167,
                speed: 0.333,
                ATTACH_POSITION: {
                    x: 167 * 9.5 / 29,
                    y: 60 / 2 * 3
                }
            },
            {
                image: loadResouce(80, 167, src`3`),
                width: 125,
                height: 167,
                speed: 0.2,
                ATTACH_POSITION: {
                    x: 190 * 9.5 / 29,
                    y: 60 / 2 * 3
                }
            },
        ];
        this.LEVELS = LEVELS;
    }
}

export class Bullet extends BaseObject {
    /**
     * @type {number}
     */
    speed;
    /**
     * @type {number}
     */
    damage;
    /**
     * @type {number}
     */
    angle;
    /**
     * @type {Coordinate}
     */
    position;

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {string} image 
     * @param {number} speed 
     * @param {number} damage 
     */
    constructor(width, height, image, speed, damage) {
        super(width, height, image);
        this.speed = speed;
        this.damage = damage
    }
}
