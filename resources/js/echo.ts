import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

window.Pusher = Pusher;

export const createEcho = () => {
    const key = import.meta.env.VITE_REVERB_APP_KEY || 'borneocare_key';
    const host = import.meta.env.VITE_REVERB_HOST || (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1');
    const port = Number(import.meta.env.VITE_REVERB_PORT || 8080);
    const scheme = import.meta.env.VITE_REVERB_SCHEME || 'http';

    return new Echo({
        broadcaster: 'reverb',
        key: key,
        wsHost: host,
        wsPort: port,
        wssPort: port,
        forceTLS: scheme === 'https',
        enabledTransports: ['ws', 'wss'],
    });
};

let echoInstance: Echo<'reverb'> | null = null;

export const getEcho = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!echoInstance) {
        try {
            echoInstance = createEcho();
            window.Echo = echoInstance;
        } catch (e) {
            console.warn('Reverb WebSocket initialization error:', e);
            return null;
        }
    }
    return echoInstance;
};

export default getEcho;
