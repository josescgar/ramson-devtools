import Messages from '../constants/Messages.js';

class BackgroundMessenger {

    constructor() {
        this.devtoolsCallbacks = [];
    }

    connectToBackground() {
        this.backgroundConnection = chrome.runtime.connect({
            name: 'ramson-devtools-page'
        });

        this.backgroundConnection.onMessage.addListener(message => {
            this.devtoolsCallbacks.forEach(cb => cb(message));
        });

        this.sendToBackgroundFromDevtools(Messages.INIT);

        console.debug("Background page connection established");
    }

    sendToBackgroundFromDevtools(type, payload) {
        this.backgroundConnection.postMessage({
            tabId: chrome.devtools.inspectedWindow.tabId,
            type: type,
            payload: payload
        });
    }

    onMessageFromBackground(callback) {
        this.devtoolsCallbacks.push(callback);
    }


}

export default new BackgroundMessenger();
