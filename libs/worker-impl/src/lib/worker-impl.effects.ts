import { Inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { helloThere, howAreYou, iAmFineThanks } from '@ng-web-worker/actions';
import { NG_WORKER_ID } from '@ng-web-worker/worker/web-worker';

@Injectable()
export class WorkerImplEffects {
  readonly howAreYou = createEffect(() =>
    this._actions$.pipe(
      ofType(helloThere),
      map((action) => {
        console.log(this.workerId, action.type);

        return howAreYou();
      })
    )
  );

  readonly hi = createEffect(
    () =>
      this._actions$.pipe(
        ofType(iAmFineThanks),
        tap((action) => {
          console.log(this.workerId, action.type);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private _actions$: Actions,
    @Inject(NG_WORKER_ID) private workerId: string
  ) {}
}
