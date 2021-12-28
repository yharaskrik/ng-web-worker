import { Injectable } from '@angular/core';
import {
  MessageEventPayload,
  NgWebWorkerCommunication,
  NgWorkerEvent,
  SendMessagePayload,
} from './types';
import {
  NG_WEB_WORKER_BROADCAST_CHANNEL,
  NG_WEB_WORKER_CONTEXT,
} from './tokens';
import { BaseChannelCommunicator } from './base-channel.communicator';

/**
 * Communicator implementation for BroadcastChannel, this will allow all NgWorkerEvents to be shared between on
 * all contexts (different tabs and web workers) without needing to pass through the main thread to send to all
 * others
 */
@Injectable()
export class BroadcastChannelCommunicator
  extends BaseChannelCommunicator
  implements NgWebWorkerCommunication
{
  private readonly port: BroadcastChannel;

  constructor(private workerId: string) {
    super();
    this.port = new BroadcastChannel(NG_WEB_WORKER_BROADCAST_CHANNEL);

    this.registerMessageListener(this.port);
  }

  registerMessageListener(port: BroadcastChannel): void {
    port.onmessage = (ev: NgWorkerEvent) => {
      // Want to make sure we do not infinitely loop somehow. Workers should not end up broadcasting to themselves
      if (ev.data.worker !== this.workerId) this.eventStream$.next(ev);
    };
  }

  sendMessage<T = any>(message: SendMessagePayload<T>): void {
    const payload: MessageEventPayload = {
      ...message,
      context: NG_WEB_WORKER_CONTEXT,
      worker: this.workerId,
    };

    this.port?.postMessage(payload);
  }
}
