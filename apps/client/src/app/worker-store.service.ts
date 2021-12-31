import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { config } from '@ng-web-worker/worker-impl';
import {
  NG_WEB_WORKER_BROADCAST_CHANNEL,
  NgInWorkerEvent,
} from '@ng-web-worker/worker/core';

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
    source: Observable<NgInWorkerEvent>
  ): Observable<NgInWorkerEvent> {
    return new Observable<NgInWorkerEvent>((subscriber) => {
      source.subscribe({
        next(payload: NgInWorkerEvent) {
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

  readonly messageChannel$ = new Subject<NgInWorkerEvent>();

  bc = new BroadcastChannel(NG_WEB_WORKER_BROADCAST_CHANNEL);

  constructor() {
    this.bc.onmessage = (ev) => this.messageChannel$.next(ev);
  }

  registerWorker(factory: WorkerFactory): BroadcastChannel | MessagePort {
    const worker = factory();

    const uuid = rand();

    this.workers.set(uuid, worker);

    if (config.broadcast) {
      // already configured
      return this.bc;
    } else {
      const channel = new MessageChannel();

      worker.postMessage(PORT_TRANSFER, [channel.port2]);

      this.channels.set(uuid, channel);

      channel.port1.onmessage = (ev: NgInWorkerEvent) => {
        this.messageChannel$.next(ev);

        for (const [channelId, otherChannel] of this.channels.entries()) {
          if (channelId !== uuid) {
            otherChannel.port1.postMessage(ev.data);
          }
        }
      };

      return channel.port1;
    }
  }

  ngOnDestroy(): void {
    this.messageChannel$.complete();
  }
}
