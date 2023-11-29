import { renderCanvas } from "./drawer.js";
import { TAB_ID, initSyncChannel } from "./utils/sync.js";
import { UIComponent } from "./types/element.js";
import { startWindowMoveEventDispatcher } from "./utils/window-move.js";

(function() {
    const tid = new UIComponent('title');
    tid.text = `Client ${TAB_ID}`;

    startWindowMoveEventDispatcher();

    initSyncChannel();

    renderCanvas();
})()