import { Messages } from './services/BackgroundMessenger';

const connections = {};

/**
 * Listen for connections from the DevTools page.
 * message.tabId is the ID of the inspected page
 */
chrome.runtime.onConnect.addListener(devToolsConnection => {
    let listeningToTabId;

    let backgroundListener = (message, sender, sendResponse) => {
        switch (message.type) {
            case Messages.INIT:
                listeningToTabId = message.tabId;
                connections[listeningToTabId] = devToolsConnection;
                break;
            case Messages.INJECT_SCRIPT:
                injectScript(message.tabId, message.payload.file);
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
    if (connections[sender.tab.id]) {
        connections[sender.tab.id].postMessage(request);
    }
});

function injectScript(tabId, fileName) {
    chrome.tabs.executeScript(tabId, {
       file: fileName
    });
}