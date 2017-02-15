import { BackgroundMessenger } from '../services/BackgroundMessenger';

BackgroundMessenger.connectToBackground();
BackgroundMessenger.onMessageFromBackground(message => {
    console.debug(message);
});