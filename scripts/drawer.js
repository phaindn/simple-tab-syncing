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

import { createMessage, syncChannel } from "./utils/sync.js";
import { CannonShooter, MachineGunShooter, MissileLauncherShooter, Tower } from "./types/game.js";

export function renderCanvas() {
    const params = new URLSearchParams(location.search);
    const level = params.get('level') || 0;
    const type = params.get('type');

    let ShooterConstructor = MachineGunShooter;
    switch(type) {
        case 'cannon': {
            ShooterConstructor = CannonShooter;
            break;
        }
        case 'missile': {
            ShooterConstructor = MissileLauncherShooter;
            break;
        }
    }

    /**
     * @type {Record<string, Opponent>}
     */
    const opponents = {};

    let center = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    }

    function _render() {
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

        Object.values(opponents).forEach(opponent => {
            const tower = new Tower();
            tower.attach(new ShooterConstructor(Math.PI / 2, level));
            
            if (!opponent) {
                tower.drawTo(ctx, center.x, center.y);
                return;
            }

            const lineTo = {
                x: opponent.screenLeft + opponent.center.x - screenLeft,
                y: opponent.screenTop + opponent.center.y - screenTop,
            }

            ctx.beginPath();
            ctx.moveTo(center.x, center.y)
            ctx.lineTo(lineTo.x, lineTo.y);
            ctx.stroke();

            const O = {
                x: screenLeft + center.x,
                y: screenTop + center.y,
            }

            const B = {
                x: opponent.screenLeft + opponent.center.x - O.x,
                y: opponent.screenTop + opponent.center.y - O.y,
            }
            const angle = Math.atan(B.y / B.x);

            if (B.x >= 0) {
                tower.rotateGun(angle);
            } else {
                tower.rotateGun(angle + Math.PI);
            }
            tower.drawTo(ctx, center.x, center.y);
        })

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

    syncChannel.addEventListener('message', (event) => {
        switch (event.data.type) {
            case 'ping': {
                opponents[event.data.id] = event.data.data
                syncChannel.postMessage(createMessage('pong', getPingData()));
                break;
            }
            case 'pong': {
                opponents[event.data.id] = event.data.data
                break;
            }
            case 'disconnect': {
                delete opponents[event.data.id];
                break;
            }
        }
        requestAnimationFrame(() => {
            _render();
        })
    })
    syncChannel.postMessage(createMessage('ping', getPingData()));
    window.addEventListener('windowmove', (event) => {
        syncChannel.postMessage(createMessage('ping', getPingData()));
    });
    window.addEventListener('resize', (event) => {
        syncChannel.postMessage(createMessage('ping', getPingData()));
    });
    _render();
}