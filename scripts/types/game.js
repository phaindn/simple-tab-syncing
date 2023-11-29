/**
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 */

// function loadResouce(width, height, src) {
//     const image = new Image(width, height);
//     image.src = src;
//     image.onload = (ev) => {
//         console.log(ev)
//     }

//     return image;
// }

// const RESOURCES = {
//     tower: loadResouce(80, 80, '/assets/Tower.png'),
// }

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
     * @constant
     * @type {Coordinate}
     */
    ATTACH_POSITION;

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
        // x = x - this.ATTACH_POSITION.x;
        // y = y - this.ATTACH_POSITION.y;
        this.x = x;
        this.y = y;
        if (this.#image.complete) {
            this.draw(ctx);
        } else {
            this.#image.onload = () => {
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
        ctx.drawImage(this.#image, cw/2 - this.ATTACH_POSITION.x, ch/2 - this.ATTACH_POSITION.y, this.width, this.height);
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
export class Shooter extends BaseObject {
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

export class MachineGunShooter extends Shooter {

    /**
     * @param {number} angle 
     */
    constructor(angle = 0) {
        const w = 80;
        const h = 167;
        super(w, h, '/assets/MG.png', 5, angle, Bullet, h * 9.5 / 29, w / 2 * 3);
    }
}

// ========================== Exports ==========================

window.Tower = Tower;
window.Shooter = Shooter;
window.Bullet = Bullet;
