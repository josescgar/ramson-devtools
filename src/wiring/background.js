const connections = {};

/**
 * Listen for connections from the DevTools page.
 * message.tabId is the ID of the inspected page
 */
chrome.runtime.onConnect.addListener(devToolsConnection => {
    let listeningToTabId;

    let backgroundListener = (message, sender, sendResponse) => {
        switch (message.type) {
            case 'init-conn':
                listeningToTabId = message.tabId;
                connections[listeningToTabId] = {recording: false, connection: devToolsConnection};
                break;
            case 'recording-status':
                connections[message.tabId].recording = message.payload || false;
                break;
        }
    };

    devToolsConnection.onMessage.addListener(backgroundListener);
    devToolsConnection.onDisconnect.addListener(() => {
        devToolsConnection.onMessage.removeListener(backgroundListener);
        connections[listeningToTabId] = null;
    });
});

/**
 * Listen for content script messages and forward them
 * to any interested devtools page
 */
chrome.runtime.onMessage.addListener((request, sender) => {
    let conn = connections[sender.tab.id];
    if (conn && conn.recording) {
        conn.connection.postMessage(request);
    }
});