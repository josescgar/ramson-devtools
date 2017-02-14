import { Messages } from './services/backgroundMessenger';

chrome.runtime.onConnect.addListener(devToolsConnection => {

    let backgroundListener = (message, sender, sendResponse) => {
        switch (message.type) {
            case Messages.INJECT_SCRIPT:
                injectScript(message.tabId, message.payload.file);
                break;
        }
    };

    devToolsConnection.onMessage.addListener(backgroundListener);
    devToolsConnection.onDisconnect.addListener(() => devToolsConnection.onMessage.removeListener(backgroundListener));
});

function injectScript(tabId, fileName) {
    chrome.tabs.executeScript(tabId, {
       file: fileName
    });
}