import { Inject, Injectable } from '@angular/core';
import {
  BROADCAST_CHANNEL,
  MessageDispatcher,
  MessageEventPayload,
  MessageEventStream,
  NgInWorkerEvent,
  NG_IN_WORKER_CONFIG,
  NG_IN_WORKER_CONTEXT,
  SendMessagePayload,
  WorkerConfig,
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
  constructor(
    @Inject(NG_IN_WORKER_CONFIG)
    private config: WorkerConfig,
    private messageEventStream: MessageEventStream,
    @Inject(BROADCAST_CHANNEL) private broadcastChannel: BroadcastChannel
  ) {
    this.registerMessageListener(this.broadcastChannel);
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
      context: NG_IN_WORKER_CONTEXT,
      workerId: this.config.workerId,
    };

    this.broadcastChannel.postMessage(payload);
  }
}
