/**
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 */

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

class Tower extends BaseObject {
    /**
     * @type {Shooter}
     */
    gun;

    /**
     * @constant
     * @type {Coordinate}
     */
    ATTACH_POSITION;

    constructor() {
        super(120, 120, '/assets/Tower.png');
        this.ATTACH_POSITION = {
            x: 60,
            y: 60,
        }
    }

    /**
     * @param {number} degree 
     */
    rotateGun(degree) {
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

class Shooter extends BaseObject {
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
    level;

    /**
     * @constant
     * @type {Coordinate}
     */
    ATTACH_POSITION;

    /**
     * @type {Bullet}
     */
    Bullet;

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {string} image 
     * @param {number} speed 
     * @param {Bullet} bullet 
     */
    constructor(width, height, image, speed, bullet) {
        super(width, height, image);
        this.speed = speed;
        this.Bullet = bullet;
        this.level = 1;
    }

    /**
     * @overload
     * @param {number} width 
     * @param {number} height 
     * @param {string} image 
     * @param {number} speed 
     * @param {Bullet} bullet 
     */
    constructor(width, height, image, speed, angle, bullet) {
        super(width, height, image);
        this.speed = speed;
        this.angle = angle;
        this.Bullet = bullet;
        this.level = 1;
    }

    /**
     * @overload
     * @param {number} width 
     * @param {number} height 
     * @param {string} image 
     * @param {number} speed 
     * @param {Bullet} bullet 
     * @param {number} attachPositionX 
     * @param {number} attachPositionY 
     */
    constructor(width, height, image, speed, angle, bullet, attachPositionX, attachPositionY) {
        super(width, height, image);
        this.speed = speed;
        this.angle = angle;
        this.Bullet = bullet;
        this.level = 1;
        this.ATTACH_POSITION = {
            x: attachPositionX,
            y: attachPositionY,
        }
    }

    /**
     * @param {Tower} tower 
     */
    attachTo(tower) {
        tower.attach(tower);
    }

    shoot() {
        let b = this.#createBullet()
    }

    #createBullet() {
    }
}

class Bullet extends BaseObject {
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
