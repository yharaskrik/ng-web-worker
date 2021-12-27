import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

/**
 * Communicator implementation for BroadcastChannel, this will allow all NgWorkerEvents to be shared between on
 * all contexts (different tabs and web workers) without needing to pass through the main thread to send to all
 * others
 */
@Injectable()
export class BroadcastChannelCommunicator implements NgWebWorkerCommunication {
  readonly messages$ = new Subject<NgWorkerEvent>();

  private readonly port: MessagePort | BroadcastChannel | undefined;

  constructor(private workerId: string) {
    this.port = new BroadcastChannel(NG_WEB_WORKER_BROADCAST_CHANNEL);
  }

  registerMessageListener(port: MessagePort | BroadcastChannel): void {
    port.onmessage = (ev) => {
      if (ev.data.context === NG_WEB_WORKER_CONTEXT) {
        this.messages$.next(ev as NgWorkerEvent);
      }
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
