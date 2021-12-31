import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import {
  NG_IN_WEB_WORKER_CONTEXT,
  NgInWorkerEvent,
} from '@ng-web-worker/worker/core';

/**
 * The BaseChannelCommunicator contains the shared properties that both the Broadcast method and MessageChannel
 * method use to stream events.
 */
@Injectable()
export class BaseChannelCommunicator {
  /*
   * The full event stream from the BroadcastChannel or the MessageChannel, these may contain other
   * events other than ones specifically sent from others WebWorkers or the main thread that this worker
   * should care about.
   */
  protected readonly eventStream$ = new Subject<MessageEvent>();

  /*
   * The filtered stream of events. Only events with the `NG_IN_WEB_WORKER_CONTEXT` context should be allowed
   * through this, so we know the events are in the right format.
   */
  protected readonly events$ = this.eventStream$.pipe(
    filter(
      (ev): ev is NgInWorkerEvent =>
        ev.data?.context === NG_IN_WEB_WORKER_CONTEXT
    )
  );

  stream(): Observable<NgInWorkerEvent> {
    return this.events$;
  }
}