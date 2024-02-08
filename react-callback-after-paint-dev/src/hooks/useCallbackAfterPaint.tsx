import { useEffect } from "react";

/**
 * Runs `callback` shortly after the next browser Frame is produced.
 */
function runAfterFramePaint(callback) {
    requestAnimationFrame(() => {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = callback;
        messageChannel.port2.postMessage(undefined);
    });
}

export function useMarkFramePaint({ markName, enabled, cb }) {
    useEffect(() => {
        /**
         * Only perform the log when the calling component has signaled it is
         * ready to log a meaningful visual update.
         */
        if (!enabled) {
            return;
        }

        // Queues a requestAnimationFrame and onmessage
        runAfterFramePaint(() => {
            // Set a performance mark shortly after the frame has been produced.
            console.log("Rendered");
            performance.mark(markName);
            cb();
        });
    }, [markName, enabled])
}