import { Injectable } from '@angular/core';
import { filter, Observable, Subject } from 'rxjs';
import {
  NG_WEB_WORKER_CONTEXT,
  NgWorkerEvent,
} from '@ng-web-worker/worker/communication';

@Injectable()
export class BaseChannelCommunicator {
  protected readonly eventStream$ = new Subject<MessageEvent>();

  protected readonly events$ = this.eventStream$.pipe(
    filter(
      (ev): ev is NgWorkerEvent => ev.data.context === NG_WEB_WORKER_CONTEXT
    )
  );

  stream(): Observable<NgWorkerEvent> {
    return this.events$;
  }
}
