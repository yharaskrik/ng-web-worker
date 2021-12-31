import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import { NG_WORKER_ID } from '@ng-web-worker/worker/web-worker';
import { Action } from '@ngrx/store';
import {
  COMMUNICATOR,
  MessageDispatcher,
  MessageEventPayload,
  MessageEventStream,
} from '@ng-web-worker/worker/core';

@Injectable()
export class WebWorkerActionConnector {
  /**
   * Will stream the actions received through the messaging channels to the Store within
   * this web worker.
   */
  readonly channelToAction$ = createEffect(() =>
    this.messageEventStream.stream().pipe(
      map((event) => event.data),
      filter(
        (data): data is MessageEventPayload<Action & { workerId: string }> =>
          /*
           * We should only be mapping external actions (from other web workers or main thread) to the action
           * stream within this web worker.
           */
          data.event === 'action' &&
          (!data.payload.workerId || this.workerId !== data.payload.workerId)
      ),
      map((data) => data.payload)
    )
  );

  /**
   * We need to ensure that any actions dispatched from within this context are sent to the other contexts.
   *
   * This effect will run from within Web Workers as well as in the main thread.
   *
   * If there is no workerId patched onto the action yet that means it originated from within this same context
   * and needs to be send along through the channels.
   *
   * If there is a workerId, but we are currently in the `main` thread then we need to make sure our other contexts
   * receive this action as well, so we allow it through to be sent along. In the `main` context the communicator is
   * configured to send all messages to all registered MessageChannel ports and the Broadcast channel.
   */
  readonly actionToChannel$ = createEffect(
    () =>
      this._actions$.pipe(
        filter(
          (action) => !(action as any).workerId || this.workerId === 'main'
        ),
        map((action) => {
          this.communicator.sendMessage({
            event: 'action',
            /*
             * External must be patched onto the action here otherwise when the other contexts receive it
             * they will not allow it to pass through the stream from `WebWorkerActions`
             */
            payload: { ...action, workerId: this.workerId },
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private messageEventStream: MessageEventStream,
    @Inject(NG_WORKER_ID) private workerId: string,
    private _actions$: Actions,
    @Inject(COMMUNICATOR) private communicator: MessageDispatcher
  ) {}
}
