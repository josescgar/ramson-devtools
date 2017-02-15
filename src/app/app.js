import { BackgroundMessenger } from './BackgroundMessenger';

BackgroundMessenger.connectToBackground();
BackgroundMessenger.onMessageFromBackground(message => {
    console.debug(message);
});