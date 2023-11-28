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
        ctx.beginPath();
        ctx.arc(center.x, center.y, 40, 0, 2 * Math.PI);
        ctx.stroke();

        if (!opponent) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(center.x, center.y)
        let lineTo = {
            x: opponent.screenLeft + opponent.center.x - screenLeft,
            y: opponent.screenTop + opponent.center.y - screenTop,
        }
        ctx.lineTo(lineTo.x, lineTo.y);
        ctx.stroke();
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