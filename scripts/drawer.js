/**
 * @typedef {Object} Coordinate
 * @property {number} x
 * @property {number} y
 */
/**
 * @typedef {Object} Opponent
 * @property {number} screenTop
 * @property {number} screenLeft
 * @property {number} innerWidth
 * @property {number} outerWidth
 * @property {number} innerHeight
 * @property {number} outerHeight
 * @property {Coordinate} center
 */

import { MachineGunShooter, Tower } from "./types/game.js";

(function draw() {
    /**
     * @type {BroadcastChannel}
     */
    const bc = window.bc;

    /**
     * @type {Opponent}
     */
    let opponent;
    let center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    }

    function render() {
        center = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        }
        /**
         * @type {HTMLCanvasElement}
         */
        const $canvas = document.querySelector('#app');
        $canvas.width = window.innerWidth;
        $canvas.height = window.innerHeight;
        const ctx = $canvas.getContext("2d");
        ctx.reset()

        ctx.beginPath();
        ctx.arc(center.x, center.y, 120, 0, 2 * Math.PI);
        ctx.stroke();

        const tower = new Tower();
        tower.attach(new MachineGunShooter(Math.PI / 2));
        
        if (!opponent) {
            tower.drawTo(ctx, center.x, center.y);
            return;
        }

        const lineTo = {
            x: opponent.screenLeft + opponent.center.x - screenLeft,
            y: opponent.screenTop + opponent.center.y - screenTop,
        }
        const current = {
            x: screenLeft + center.x,
            y: screenTop + center.y,
        }
        const currentVector = {
            x: 0,
            y: current.y,
        }
        const lineToVector = {
            x: current.x - lineTo.x,
            y: current.y - lineTo.y,
        }

        ctx.reset();

        ctx.beginPath();
        ctx.moveTo(center.x, center.y)
        ctx.lineTo(lineTo.x, lineTo.y);
        ctx.stroke();

        const cosine = (currentVector.x * lineToVector.x + currentVector.y * lineToVector.y) / (Math.sqrt(currentVector.x**2 + currentVector.y**2) * Math.sqrt(lineToVector.x**2 + lineToVector.y**2));

        const angle = Math.acos(cosine) / Math.PI * 180;
        tower.rotateGun(angle);
        tower.drawTo(ctx, center.x, center.y);
        
        
    }

    function getPingData() {
        return {
            screenLeft,
            screenTop,
            outerWidth,
            outerHeight,
            innerWidth,
            innerHeight,
            center,
        };
    }

    bc.addEventListener('message', (event) => {
        switch (event.data.type) {
            case 'ping': {
                opponent = event.data.data;
                bc.postMessage(createMessage('pong', getPingData()));
                break;
            }
            case 'pong': {
                opponent = event.data.data;
                break;
            }
            case 'disconnect': {
                opponent = undefined;
                break;
            }
        }
        render();
    })
    bc.postMessage(createMessage('ping', getPingData()));
    window.addEventListener('windowmove', (event) => {
        bc.postMessage(createMessage('ping', getPingData()));
    });
    window.addEventListener('resize', (event) => {
        bc.postMessage(createMessage('ping', getPingData()));
    });
    render();
})();