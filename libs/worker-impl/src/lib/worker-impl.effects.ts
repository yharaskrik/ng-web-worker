import { Inject, Injectable } from '@angular/core';
import { helloThere, howAreYou, iAmFineThanks } from '@ng-web-worker/actions';
import {
  NgInWorkerConfig,
  NG_WEB_WORKER_CONFIG,
} from '@ng-web-worker/worker/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs';

@Injectable()
export class WorkerImplEffects {
  readonly howAreYou = createEffect(() =>
    this._actions$.pipe(
      ofType(helloThere),
      map((action) => {
        console.log(this.config.workerId, action.type);

        return howAreYou();
      })
    )
  );

  readonly hi = createEffect(
    () =>
      this._actions$.pipe(
        ofType(iAmFineThanks),
        tap((action) => {
          console.log(this.config.workerId, action.type);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private _actions$: Actions,
    @Inject(NG_WEB_WORKER_CONFIG) private config: NgInWorkerConfig
  ) {}
}
