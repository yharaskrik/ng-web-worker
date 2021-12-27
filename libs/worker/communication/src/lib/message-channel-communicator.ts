import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  MessageEventPayload,
  NgWebWorkerCommunication,
  SendMessagePayload,
} from './types';
import { NG_WEB_WORKER_CONTEXT } from './tokens';

/**
 * Service to track the single MessageChannel with the main thread. A MessagePort will be transferred from
 * the main thread to the WebWorker which will be stored and listened on to be able to send and receive
 * messages back and forth (in the future the ngrx plugin will use this to send actions two ways)
 */
@Injectable()
export class MessageChannelCommunicator implements NgWebWorkerCommunication {
  private port: MessagePort | undefined;

  readonly messages$ = new Subject<MessageEvent>();

  constructor(private workerId: string) {
    addEventListener('message', (ev) => {
      if (ev.data === 'portTransfer') {
        this.port = ev.ports[0];
        this.registerMessageListener(this.port);
      }
    });
  }

  registerMessageListener(messagePort: MessagePort): void {
    messagePort.onmessage = (ev) => {
      this.messages$.next(ev);
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
