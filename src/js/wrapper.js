const RealWebSocket = WebSocket;
WebSocket = function (...args) {
    let ws = new RealWebSocket(...args);

    const originalSendFunc = ws.send;
    ws.send = function (data) {
        sendToContentScript(args[0], 'send', data);
        originalSendFunc.apply(this, arguments);
    };

    ws.addEventListener('message', function (message) {
        sendToContentScript(args[0], 'receive', message.data);
    });

    return ws;
}

function sendToContentScript(source, type, data) {
    window.dispatchEvent(new CustomEvent('ramson-ws-activity', {
        detail: {
            source: source,
            type: type,
            data: data
        }
    }));
}