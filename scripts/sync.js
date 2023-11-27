// declaration
const TAB_ID = `${Date.now()}_${Math.round(Math.random()*100000)}`;

// utilization
function message(type, data) {
    return {
        id: TAB_ID,
        type,
        data
    }
}

// initialization
const bc = new BroadcastChannel('app_sync');

bc.addEventListener('message', (event) => {
    console.log(event);
});

window.addEventListener('beforeunload', () => {
    if (bc) {
        bc.postMessage(message('disconnect'))
        bc.close();
    }
});


// app
bc.postMessage(message('connect'));
const tid = new UIComponent('title');
tid.text = `Client ${TAB_ID}`;
/**
 * @type HTMLCanvasElement
 */
const $canvas = document.querySelector('#app');
(function draw() {
    const ctx = $canvas.getContext("2d");
    const center = {
        x: 95,
        y: 50,
    }
    ctx.beginPath();
    ctx.arc(center.x, center.y, 40, 0, 2 * Math.PI);
    ctx.stroke();

    const screen = window.screen;
    let isLeftSide = screen.availWidth / 2.2 > window.screenLeft;
    if (isLeftSide) {
        const screenRight = window.screenLeft + window.innerWidth;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y)
        ctx.lineTo(screenRight - center.x, center.y)
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(center.x, center.y)
        ctx.lineTo(0, center.y)
        ctx.stroke();
    }
})();

// window.addEventListener('')