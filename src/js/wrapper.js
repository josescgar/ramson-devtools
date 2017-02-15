const RealWebSocket = WebSocket;
WebSocket = function (...args) {
    let ws = new RealWebSocket(...args);

    const originalSendFunc = ws.send;
    ws.send = function (data) {
        sendToContentScript(data);
        originalSendFunc.apply(this, arguments);
    };

    ws.addEventListener('message', function (message) {
        sendToContentScript(message.data);
    });

    return ws;
}

function sendToContentScript(data) {
    window.dispatchEvent(new CustomEvent('ramson-ws-activity', {
        detail: data
    }));
}