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
