import { Injectable, OnDestroy } from '@angular/core';
import { NgInWorkerConfig } from './types';
import {
  MessageEventPayload,
  NG_IN_WORKER_PORT_TRANSFER,
  NG_WEB_WORKER_BROADCAST_CHANNEL,
  NgInWorkerEvent,
} from '@ng-web-worker/worker/core';
import { Subject } from 'rxjs';

@Injectable()
export class WebWorkerRegistry implements OnDestroy {
  private readonly workers = new Map<string, Worker>();

  private readonly workerConfigs = new Map<string, NgInWorkerConfig>();

  private readonly messageChannels = new Map<string, MessageChannel>();

  private readonly broadcastChannel = new BroadcastChannel(
    NG_WEB_WORKER_BROADCAST_CHANNEL
  );

  readonly stream$ = new Subject<NgInWorkerEvent>();

  constructor() {
    /*
     * Set up the listener for the broadcast channel to ensure that all events are sent into the global
     * NgInWorker event stream
     */
    this.broadcastChannel.onmessage = (ev: NgInWorkerEvent) =>
      this.stream$.next(ev);
  }

  ngOnDestroy(): void {
    this.stream$.complete();
  }

  /**
   * Register a web worker and set up the listeners
   * @param config
   */
  registerWorker(config: NgInWorkerConfig): void {
    const { workerId, factory, broadcast } = config;
    if (this.workers.has(workerId)) {
      console.warn(`${workerId} already registered. Skipping.`);
      return;
    }

    if (!factory) {
      return;
    }

    this.workerConfigs.set(workerId, config);

    const worker = factory();

    this.workers.set(workerId, worker);

    /*
     * Worker is setup for using MessageChannel instead of the main Broadcast channel.
     */
    if (!broadcast) {
      this.registerWorkersMessageChannel(workerId, worker);
    }
  }

  registerWorkersMessageChannel(workerId: string, worker: Worker): void {
    const channel = new MessageChannel();

    this.messageChannels.set(workerId, channel);

    // Transfer port2 and leave port1 available for the main thread to sent messages to port2.
    worker.postMessage(NG_IN_WORKER_PORT_TRANSFER, [channel.port2]);

    channel.port1.onmessage = (ev: NgInWorkerEvent) => this.stream$.next(ev);
  }

  sendMessage(workerId: string, message: MessageEventPayload): void {
    const config = this.workerConfigs.get(workerId);

    if (!config) {
      throw new Error(`${workerId} not registered.`);
    }

    if (config.broadcast) {
      this.broadcastChannel.postMessage(message);
    } else {
      this.messageChannels.get(workerId)?.port1.postMessage(message);
    }
  }
}
