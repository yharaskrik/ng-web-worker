import { Injectable } from '@angular/core';
import {
  MessageEventPayload,
  NgWebWorkerCommunication,
  SendMessagePayload,
} from './types';
import { NG_WEB_WORKER_CONTEXT } from './tokens';
import { BaseChannelCommunicator } from './base-channel.communicator';

/**
 * Service to track the single MessageChannel with the main thread. A MessagePort will be transferred from
 * the main thread to the WebWorker which will be stored and listened on to be able to send and receive
 * messages back and forth (in the future the ngrx plugin will use this to send actions two ways)
 */
@Injectable()
export class MessageChannelCommunicator
  extends BaseChannelCommunicator
  implements NgWebWorkerCommunication
{
  private port: MessagePort | undefined;

  constructor(private workerId: string) {
    super();
    addEventListener('message', (ev) => {
      if (ev.data === 'portTransfer') {
        this.port = ev.ports[0];
        this.registerMessageListener(this.port);
      }
    });
  }

  registerMessageListener(messagePort: MessagePort): void {
    messagePort.onmessage = (ev) => {
      this.eventStream$.next(ev);
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
