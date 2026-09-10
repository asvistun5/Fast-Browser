import { session } from 'electron';
import { ElectronBlocker } from '@ghostery/adblocker-electron';
import fetch from 'cross-fetch';

let blocker = null;

export async function setupBlocker(sess = session.fromPartition('persist:guest')) {
    blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);

    blocker.enableBlockingInSession(sess, {
        urls: ['*://*/*'],
        onBeforeRequest: (details) => {
            const url = details.url;

            if (
                url.startsWith('file://') ||
                url.startsWith('http://localhost') ||
                url.startsWith('http://127.0.0.1')
            ) {
                return false;
            }

            return true;
        }
    });

    console.log('Blocker ready');
}