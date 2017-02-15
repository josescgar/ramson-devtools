/**
 * Chrome creates an isolated "world" for content scripts. Since we want
 * to create a wrapper around the native Websocket we need to inject that
 * inside the actual page scope
 */
let script = document.createElement('script');
script.src = chrome.extension.getURL('wrapper.js');
script.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(script);

/**
 * Websocket activity will be forwarded from the injected script as events.
 * We need to forward the data in the event to the background page, which will
 * in turn forward it to the right devtools page. 
 */
window.addEventListener('ramson-ws-activity', function (event) {
    chrome.runtime.sendMessage(event.detail);
});