import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  helloThere,
  hi,
  howAreYou,
  iAmFineThanks,
} from '@ng-web-worker/actions';
import { NG_WORKER_ID } from '@ng-web-worker/worker/web-worker';

@Injectable()
export class WorkerImplSecEffects {
  readonly helloThere = createEffect(() =>
    this._actions$.pipe(
      ofType(hi),
      map((action) => {
        console.log(this.workerId, action.type);

        return helloThere();
      })
    )
  );

  readonly iAmFineThanks = createEffect(() =>
    this._actions$.pipe(
      ofType(howAreYou),
      map((action) => {
        console.log(this.workerId, action.type);

        return iAmFineThanks();
      })
    )
  );

  constructor(
    private _actions$: Actions,
    @Inject(NG_WORKER_ID) private workerId: string
  ) {}
}
