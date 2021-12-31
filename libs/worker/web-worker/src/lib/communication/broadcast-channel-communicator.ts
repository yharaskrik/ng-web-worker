import { Inject, Injectable } from '@angular/core';
import { NgWebWorkerCommunication } from './types';
import { NG_WORKER_ID } from '../tokens';
import {
  MessageDispatcher,
  MessageEventPayload,
  MessageEventStream,
  NG_IN_WEB_WORKER_CONTEXT,
  NG_WEB_WORKER_BROADCAST_CHANNEL,
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
  implements NgWebWorkerCommunication, MessageDispatcher
{
  private readonly port: BroadcastChannel;

  constructor(
    @Inject(NG_WORKER_ID) private workerId: string,
    private messageEventStream: MessageEventStream
  ) {
    this.port = new BroadcastChannel(NG_WEB_WORKER_BROADCAST_CHANNEL);

    this.registerMessageListener(this.port);
  }

  registerMessageListener(port: BroadcastChannel): void {
    port.onmessage = (ev: NgInWorkerEvent) => {
      // Want to make sure we do not infinitely loop somehow. Workers should not end up broadcasting to themselves
      if (ev.data.workerId !== this.workerId)
        this.messageEventStream.dispatchMessage(ev);
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
