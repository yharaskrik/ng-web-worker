import { filter, Observable } from 'rxjs';
import type { NgInWorkerEvent } from './types';

/**
 * Filters an event stream from the BroadcastChannel by the event and optionally by the workerId
 * @param event
 * @param workerId
 */
export function ofEvent<T>(event: string, workerId?: string) {
  return (
    source$: Observable<NgInWorkerEvent>
  ): Observable<NgInWorkerEvent<T>> =>
    source$.pipe(
      filter(
        (source): source is NgInWorkerEvent<T> =>
          source.data.event === event &&
          (workerId == null || source.data.workerId === workerId)
      )
    );
}
