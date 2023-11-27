(function draw() {
    /**
     * @type HTMLCanvasElement
     */
    const $canvas = document.querySelector('#app');
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