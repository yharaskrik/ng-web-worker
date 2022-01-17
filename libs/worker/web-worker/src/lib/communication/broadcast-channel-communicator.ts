import { Inject, Injectable } from '@angular/core';
import {
  MessageDispatcher,
  MessageEventPayload,
  MessageEventStream,
  NgInWorkerConfig,
  NgInWorkerEvent,
  NG_IN_WEB_WORKER_CONTEXT,
  NG_WEB_WORKER_BROADCAST_CHANNEL,
  NG_WEB_WORKER_CONFIG,
  SendMessagePayload,
} from '@ng-web-worker/worker/core';
import { NgWebWorkerCommunication } from './types';

/**
 * Communicator implementation for BroadcastChannel, this will allow all NgWorkerEvents to be shared between on
 * all contexts (different tabs and web workers) without needing to pass through the main thread to send to all
 * others
 */
@Injectable()
export class BroadcastChannelCommunicator
  implements NgWebWorkerCommunication, MessageDispatcher
{
  private readonly port: BroadcastChannel;

  constructor(
    @Inject(NG_WEB_WORKER_CONFIG)
    private config: NgInWorkerConfig,
    private messageEventStream: MessageEventStream
  ) {
    const channel = this.config.share
      ? NG_WEB_WORKER_BROADCAST_CHANNEL
      : `${this.config.instanceId}:${NG_WEB_WORKER_BROADCAST_CHANNEL}`;

    this.port = new BroadcastChannel(channel);

    this.registerMessageListener(this.port);
  }

  registerMessageListener(port: BroadcastChannel): void {
    port.onmessage = (ev: NgInWorkerEvent) => {
      // Want to make sure we do not infinitely loop somehow. Workers should not end up broadcasting to themselves
      if (ev.data.workerId !== this.config.workerId)
        this.messageEventStream.dispatchMessage(ev);
    };
  }

  sendMessage<T = any>(message: SendMessagePayload<T>): void {
    const payload: MessageEventPayload = {
      ...message,
      context: NG_IN_WEB_WORKER_CONTEXT,
      workerId: this.config.workerId,
    };

    this.port?.postMessage(payload);
  }
}
