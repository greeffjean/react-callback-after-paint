import { useEffect } from "react";

/**
 * Runs `callback` shortly after the next browser Frame is produced.
 */
function runAfterFramePaint(callback: () => void) {
    requestAnimationFrame(() => {
        const messageChannel = new MessageChannel();

        messageChannel.port1.onmessage = callback;
        messageChannel.port2.postMessage(undefined);
    });
}

type useCallbackAfterPaintProps = {
    markName?: string;
    enabled: boolean;
    cb?: () => void;
}

export function useCallbackAfterPaint({ markName, enabled, cb }: useCallbackAfterPaintProps) {
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
            performance.mark((markName ?? "MyPerformanceMark"));
           if(cb) cb();
        });
    }, [markName, enabled])
}