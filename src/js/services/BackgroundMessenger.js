export const Messages = {
    INJECT_SCRIPT: 'inject-script'
};

class BackgroundMessengerService {

    constructor() {
        this.backgroundCallbacks = [];
    }

    connectToBackground() {
        this.backgroundConnection = chrome.runtime.connect({
            name: 'ramson-devtools-page'
        });

        this.backgroundConnection.onMessage.addListener(message => {
            this.backgroundCallbacks.forEach(cb => cb(message));
        });

        console.debug("Background page connection established");
    }

    sendToBackground(type, payload) {
        this.backgroundConnection.postMessage({
            tabId: chrome.devtools.inspectedWindow.tabId,
            type: type,
            payload: payload
        });
    }

    onBackgroundMessage(callback) {
        this.backgroundCallbacks.push(callback);
    }
}

export let BackgroundMessenger = new BackgroundMessengerService();
