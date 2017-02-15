class WebsocketWrapperService {

    wrap() {
        console.debug("Wrapping websockets");

        // const original = WebSocket;
        // WebSocket = function(url) {
        //     debugger;
        //     return new original(url);
        // }

        var sockets;

        WebSocket = new Proxy(WebSocket, {
            construct: function(target, argumentsList, newTarget) {
                debugger;
                sockets = new target(...argumentsList);

                new Proxy(sockets, {
                    apply: function(a,b,c) {
                        debugger;
                    },
                    set: function(a,b,c) {

                    }
                })

                return sockets;
            }
        });


    }
}

export const WebsocketWrapper = new WebsocketWrapperService();