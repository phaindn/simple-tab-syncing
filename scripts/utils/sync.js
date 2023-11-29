// declaration
export const TAB_ID = `${Date.now()}_${Math.round(Math.random()*100000)}`;
export function createMessage(type, data) {
    return {
        id: TAB_ID,
        type,
        data
    }
}

export const syncChannel = new BroadcastChannel('app_sync');

export function initSyncChannel() {
    
    window.addEventListener('beforeunload', () => {
        if (syncChannel) {
            syncChannel.postMessage(createMessage('disconnect'))
            syncChannel.close();
        }
    });

    // app
    syncChannel.postMessage(createMessage('connect'));
}