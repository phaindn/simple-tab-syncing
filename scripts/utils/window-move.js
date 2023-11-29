export class WindowMoveEvent extends CustomEvent {
    constructor(x, y) {
        super('windowmove', {
            detail: {
                screenLeft: x,
                screenTop: y,
            }
        })
    }
}

export function startWindowMoveEventDispatcher() {
    const prevScreen = {
        x: window.screenLeft,
        y: window.screenTop,
    }

    function runTask() {
        const { screenLeft, screenTop } = window;

        if (screenLeft != prevScreen.x || screenTop != prevScreen.y) {
            prevScreen.x = screenLeft;
            prevScreen.y = screenTop
            window.dispatchEvent(new WindowMoveEvent(screenLeft, screenTop));
        }
        requestAnimationFrame(runTask);
    }

    runTask();
}