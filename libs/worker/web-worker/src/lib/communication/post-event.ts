import { MessageDispatcher } from '@ng-web-worker/worker/core';
import { Observable } from 'rxjs';

/**
 * Attach to an Observable in a Worker context to auto subscribe to it so that every emission will
 * post a new message to the BroadcastChannel
 * @param event
 * @param dispatcher
 */
export function postEvent<T>(event: string, dispatcher: MessageDispatcher) {
  return function <T>(source$: Observable<T>): Observable<T> {
    /*
     * We are in the WebWorker when doing this so hanging subscriptions aren't really a thing since
     * there are no lifecycle hooks while in this context. Everything is initialized right away and
     * everything is destroyed (the entire process) all at once as well.
     *
     * This will ensure that anytime this Observable would emit a new value it is shared across all
     * others listening for this event in any other worker or main thread. They themselves are responsible
     * for managing their lifecycles and subscriptions.
     */
    source$.subscribe((source) =>
      dispatcher.sendMessage({
        event,
        payload: source,
      })
    );

    return source$;
  };
}
