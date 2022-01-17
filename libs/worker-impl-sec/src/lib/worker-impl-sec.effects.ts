import { Inject, Injectable } from '@angular/core';
import {
  helloThere,
  hi,
  howAreYou,
  iAmFineThanks,
} from '@ng-web-worker/actions';
import {
  NgInWorkerConfig,
  NG_WEB_WORKER_CONFIG,
} from '@ng-web-worker/worker/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs';

@Injectable()
export class WorkerImplSecEffects {
  readonly helloThere = createEffect(() =>
    this._actions$.pipe(
      ofType(hi),
      map((action) => {
        console.log(this.config.workerId, action.type);

        return helloThere();
      })
    )
  );

  readonly iAmFineThanks = createEffect(() =>
    this._actions$.pipe(
      ofType(howAreYou),
      map((action) => {
        console.log(this.config.workerId, action.type);

        return iAmFineThanks();
      })
    )
  );

  constructor(
    private _actions$: Actions,
    @Inject(NG_WEB_WORKER_CONFIG) private config: NgInWorkerConfig
  ) {}
}
