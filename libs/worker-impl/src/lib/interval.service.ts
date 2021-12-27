import { Inject, Injectable } from '@angular/core';
import { interval } from 'rxjs';
import {
  COMMUNICATOR,
  NgWebWorkerCommunication,
} from '@ng-web-worker/worker/communication';

@Injectable()
export class IntervalService {
  readonly interval$ = interval(1000);

  constructor(
    @Inject(COMMUNICATOR)
    private readonly communicator: NgWebWorkerCommunication
  ) {
    this.interval$.subscribe((i) =>
      this.communicator.sendMessage({
        event: 'interval',
        payload: i,
      })
    );
  }
}
