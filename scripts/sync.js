// declaration
const TAB_ID = `${Date.now()}_${Math.round(Math.random()*100000)}`;
function createMessage(type, data) {
    return {
        id: TAB_ID,
        type,
        data
    }
}
window.bc = new BroadcastChannel('app_sync');

(function() {
    // bc.addEventListener('message', (event) => {
    //     console.log(event);
    // });
    
    window.addEventListener('beforeunload', () => {
        if (bc) {
            bc.postMessage(createMessage('disconnect'))
            bc.close();
        }
    });

    // app
    bc.postMessage(createMessage('connect'));
})();