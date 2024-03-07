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

type DependencyList = readonly unknown[];

type useCallbackAfterPaintProps = {
    markName?: string;
    enabled: boolean;
    cb?: () => void;
    dependencies?: DependencyList;
}

/** 
* Only perform the log when the calling component has signaled it is
* ready to log a meaningful visual update.
* ---
* @param {Object} args { `markName?: string`, `enabled: boolean`, `cb?: () => void`, `dependencies?: readonly unknown[]` }
*/
export function useCallbackAfterPaint({ markName, enabled, cb, dependencies = [] }: useCallbackAfterPaintProps) {
    useEffect(() => {
        if (!enabled) {
            return;
        }

        // Queues a requestAnimationFrame and onmessage
        runAfterFramePaint(() => {
            // Set a performance mark shortly after the frame has been produced.
            performance.mark((markName ?? "MyPerformanceMark"));
            if (cb) cb();
        });
    }, [markName, enabled, ...dependencies])
}