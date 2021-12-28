import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import {
  COMMUNICATOR,
  MessageEventPayload,
  NgWebWorkerCommunication,
} from '@ng-web-worker/worker/communication';
import { NG_WORKER_ID } from '@ng-web-worker/worker';
import { Action } from '@ngrx/store';

@Injectable()
export class ActionConnector {
  /**
   * Will stream the actions received through the messaging channels to the Store within
   * this web worker.
   */
  readonly channelToAction$ = createEffect(() =>
    this.communicator.stream().pipe(
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
   * We need to ensure that any actions dispatched from within this Web Worker need to be sent through
   * the communicator to the other contexts. We want to make sure that we are not just creating an infinite
   * loop, so we check to see if the `external` property has been patched onto the action. If `external` is falsy
   * then we know that the action originated from within this Web Worker, and it can be communicated back out.
   */
  readonly actionToChannel$ = createEffect(
    () =>
      this._actions$.pipe(
        filter((action) => !(action as any).workerId),
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
    @Inject(COMMUNICATOR) private communicator: NgWebWorkerCommunication,
    @Inject(NG_WORKER_ID) private workerId: string,
    private _actions$: Actions
  ) {}
}
