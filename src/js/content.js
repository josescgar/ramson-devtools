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

window.addEventListener('ramson-ws-activity', function (event) {
    console.debug(event.detail);
});