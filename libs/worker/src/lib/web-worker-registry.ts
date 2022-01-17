import { Inject, Injectable } from '@angular/core';
import {
  MessageEventPayload,
  MessageEventStream,
  NgInWorkerConfig,
  NgInWorkerEvent,
  NG_WEB_WORKER_BROADCAST_CHANNEL,
  RegisterWorkerConfig,
} from '@ng-web-worker/worker/core';
import { NG_IN_WORKER_REGISTRY_CONFIG } from './tokens';
import { NgInWorkerRegistryConfig } from './types';

@Injectable()
export class WebWorkerRegistry {
  private readonly workers = new Map<string, Worker>();

  private readonly broadcastChannel: BroadcastChannel;

  constructor(
    private messageEventStream: MessageEventStream,
    @Inject(NG_IN_WORKER_REGISTRY_CONFIG)
    private registryConfig: NgInWorkerRegistryConfig
  ) {
    const channel = this.registryConfig.share
      ? NG_WEB_WORKER_BROADCAST_CHANNEL
      : `${this.registryConfig.instanceId}:${NG_WEB_WORKER_BROADCAST_CHANNEL}`;

    this.broadcastChannel = new BroadcastChannel(channel);
    /*
     * Set up the listener for the broadcast channel to ensure that all events are sent into the global
     * NgInWorker event stream
     */
    this.broadcastChannel.onmessage = (ev: NgInWorkerEvent) =>
      this.messageEventStream.dispatchMessage(ev);
  }

  /**
   * Register a web worker and set up the listeners
   * @param config
   */
  registerWorker(config: RegisterWorkerConfig): void {
    const { workerId, factory } = config;
    if (this.workers.has(workerId)) {
      console.warn(`${workerId} already registered. Skipping.`);
      return;
    }

    if (!factory) {
      return;
    }

    const workerConfig: NgInWorkerConfig = {
      workerId,
      instanceId: this.registryConfig.instanceId,
      share: this.registryConfig.share,
    };

    const worker = factory(JSON.stringify(workerConfig));

    this.workers.set(workerId, worker);
  }

  sendMessageToWorker(message: MessageEventPayload): void {
    this.broadcastChannel.postMessage(message);
  }
}
