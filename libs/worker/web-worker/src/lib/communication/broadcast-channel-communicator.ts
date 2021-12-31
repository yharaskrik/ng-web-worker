import { Inject, Injectable } from '@angular/core';
import { NgWebWorkerCommunication } from './types';
import { BaseChannelCommunicator } from './base-channel.communicator';
import { NG_WORKER_ID } from '../tokens';
import {
  MessageEventPayload,
  NG_WEB_WORKER_BROADCAST_CHANNEL,
  NG_IN_WEB_WORKER_CONTEXT,
  NgInWorkerEvent,
  SendMessagePayload,
} from '@ng-web-worker/worker/core';

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

  constructor(@Inject(NG_WORKER_ID) private workerId: string) {
    super();
    this.port = new BroadcastChannel(NG_WEB_WORKER_BROADCAST_CHANNEL);

    this.registerMessageListener(this.port);
  }

  registerMessageListener(port: BroadcastChannel): void {
    port.onmessage = (ev: NgInWorkerEvent) => {
      // Want to make sure we do not infinitely loop somehow. Workers should not end up broadcasting to themselves
      if (ev.data.workerId !== this.workerId) this.eventStream$.next(ev);
    };
  }

  sendMessage<T = any>(message: SendMessagePayload<T>): void {
    const payload: MessageEventPayload = {
      ...message,
      context: NG_IN_WEB_WORKER_CONTEXT,
      workerId: this.workerId,
    };

    this.port?.postMessage(payload);
  }
}
