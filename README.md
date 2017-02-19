# Ramson devtools
Advanced Websocket filtering for Chrome Devtools. Add extra powers for filtering Websockets connections:

- Group by request/response (if the payload is JSON and has an `id` property identifying the messages)
- Filter by the content of the messages

Developed with React

## Installation
To add Ramson Devtools as an extension in developer mode

1. `git clone https://github.com/josescgar/ramson-devtools.git`
2. `cd ramson-devtools`
3. `npm install`
4. `npm run build`
5. Open chrome and go to `chrome://extensions/`
6. Enable `Developer mode`
7. Select `Load unpacked extension...`
8. Select the `dist` folder in the ramson-devtools folder

## Known issues
Since chrome devtools extension APIs do not offer Websocket monitoring out of the box, this extension wraps the native Websocket definition to intercept messages sent and received. This is a rather "unstable" solution and it is know to cause issues with some sites.

## Resources
- [manifest.json](https://developer.chrome.com/extensions/manifest)
- [Devtools extension docs](https://developer.chrome.com/extensions/devtools)
- [Example devtools extesion project](https://github.com/thingsinjars/devtools-extension/blob/master/manifest.json)
- [How to inject code in the page scope](http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script)
