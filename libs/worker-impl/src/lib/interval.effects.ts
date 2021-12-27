import { Inject, Injectable } from '@angular/core';
import { interval, tap } from 'rxjs';
import { createEffect } from '@ngrx/effects';
import {
  COMMUNICATOR,
  NgWebWorkerCommunication,
} from '@ng-web-worker/worker/communication';

@Injectable()
export class IntervalEffects {
  readonly interval$ = createEffect(
    () =>
      interval(1000).pipe(
        tap((i) =>
          this.communicator.sendMessage({
            event: 'interval',
            payload: i,
          })
        )
      ),
    { dispatch: false }
  );

  constructor(
    @Inject(COMMUNICATOR)
    private readonly communicator: NgWebWorkerCommunication
  ) {}
}
