import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NgWorkerEvent } from '@ng-web-worker/worker/communication';
import { config } from '@ng-web-worker/worker-impl';

/**
 * This file will eventually be turned into a library as well and abstracted for reuse.
 */

const PORT_TRANSFER = 'portTransfer';

type WorkerFactory = () => Worker;

function rand() {
  return (Math.random() + 1).toString(36).substring(7);
}

export function ofEventType(event: string) {
  return function (
    source: Observable<NgWorkerEvent>
  ): Observable<NgWorkerEvent> {
    return new Observable<NgWorkerEvent>((subscriber) => {
      source.subscribe({
        next(payload: NgWorkerEvent) {
          if (payload.data.event === event) {
            subscriber.next(payload);
          }
        },
        complete() {
          subscriber.complete();
        },
      });
    });
  };
}

@Injectable()
export class WorkerStoreService implements OnDestroy {
  private readonly workers = new Map<string, Worker>();

  private readonly channels = new Map<string, MessageChannel>();

  readonly messageChannel$ = new Subject<NgWorkerEvent>();

  registerWorker(factory: WorkerFactory): string {
    const worker = factory();

    const uuid = rand();

    this.workers.set(uuid, worker);

    if (config.broadcast) {
      const bc = new BroadcastChannel('ng-web-worker-channel');

      bc.onmessage = (ev) => this.messageChannel$.next(ev);
    } else {
      const channel = new MessageChannel();

      worker.postMessage(PORT_TRANSFER, [channel.port2]);

      this.channels.set(uuid, channel);

      channel.port1.onmessage = (ev: NgWorkerEvent) => {
        this.messageChannel$.next(ev);

        for (const [channelId, otherChannel] of this.channels.entries()) {
          if (channelId !== uuid) {
            otherChannel.port1.postMessage(ev.data);
          }
        }
      };
    }

    return uuid;
  }

  ngOnDestroy(): void {
    this.messageChannel$.complete();
  }
}
