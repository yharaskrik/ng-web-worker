import { Inject, Injectable } from '@angular/core';
import { WebWorkerActions } from './web-worker-actions';
import { Actions, createEffect } from '@ngrx/effects';
import { filter, map } from 'rxjs';
import {
  COMMUNICATOR,
  NgWebWorkerCommunication,
} from '@ng-web-worker/worker/communication';

@Injectable()
export class ActionConnector {
  /**
   * Will stream the actions received through the messaging channels to the Store within
   * this web worker.
   */
  readonly channelToAction$ = createEffect(() => this.webWorkerActions$);

  /**
   * We need to ensure that any actions dispatched from within this Web Worker need to be sent through
   * the communicator to the other contexts. We want to make sure that we are not just creating an infinite
   * loop, so we check to see if the `external` property has been patched onto the action. If `external` is falsy
   * then we know that the action originated from within this Web Worker, and it can be communicated back out.
   */
  readonly actionToChannel$ = createEffect(
    () =>
      this._actions$.pipe(
        filter((action) => !(action as any).external),
        map((action) => {
          this.communicator.sendMessage({
            event: 'action',
            /*
             * External must be patched onto the action here otherwise when the other contexts receive it
             * they will not allow it to pass through the stream from `WebWorkerActions`
             */
            payload: { ...action, external: true },
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    @Inject(COMMUNICATOR) private communicator: NgWebWorkerCommunication,
    private webWorkerActions$: WebWorkerActions,
    private _actions$: Actions
  ) {}
}
