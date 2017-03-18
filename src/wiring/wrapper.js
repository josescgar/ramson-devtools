doWrapWebsocket();

function doWrapWebsocket() {
    const RealWebSocket = WebSocket;
    WebSocket = function (...args) {
        let ws = new RealWebSocket(...args);
        let buffer = [];

        const originalSendFunc = ws.send;
        ws.send = function (data) {
            /**
             * Unfortunately, due to the timing of the wrapping, some applications
             * might try to send a message through websocket before the connection
             * is actually ready (e.g.: GitHub)
             */
            if (this.readyState === 0) {
                buffer.push(data);
                return;
            }

            sendToContentScript(args[0], 'send', data);
            originalSendFunc.apply(this, arguments);
        };

        ws.addEventListener('open', function() {
            buffer.forEach(item => ws.send(item));
        })

        ws.addEventListener('message', function (message) {
            sendToContentScript(args[0], 'receive', message.data);
        });

        return ws;
    };
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