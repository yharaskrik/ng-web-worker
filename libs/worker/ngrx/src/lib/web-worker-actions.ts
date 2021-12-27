import { Inject, Injectable } from '@angular/core';
import {
  COMMUNICATOR,
  MessageEventPayload,
  NgWebWorkerCommunication,
} from '@ng-web-worker/worker/communication';
import { filter, map, Observable, Operator } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable()
export class WebWorkerActions<V = Action> extends Observable<V> {
  constructor(@Inject(COMMUNICATOR) communicator?: NgWebWorkerCommunication) {
    super();

    if (communicator) {
      /*
       * Listen on the stream of all ng-web-worker events filter out only action events and then map the payload
       * (Action) to the stream.
       */
      this.source = communicator.stream().pipe(
        map((event) => event.data),
        filter(
          (data): data is MessageEventPayload<Action & { external: true }> =>
            /*
             * We should only be mapping external actions (from other web workers or main thread) to the action
             * stream within this web worker.
             */
            data.event === 'action' && data.payload.external
        ),
        map((data) => data.payload)
      );
    }
  }

  override lift<R>(operator?: Operator<V, R>): Observable<R> {
    const observable = new WebWorkerActions<R>();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }
}
