import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service to track the single MessageChannel with the main thread. A MessagePort will be transferred from
 * the main thread to the WebWorker which will be stored and listened on to be able to send and receive
 * messages back and forth (in the future the ngrx plugin will use this to send actions two ways)
 */
@Injectable()
export class PortService {
  private messagePort: MessagePort | undefined;

  readonly messages$ = new Subject<MessageEvent>();

  constructor() {
    addEventListener('message', (ev) => {
      if (ev.data === 'portTransfer') {
        this.messagePort = ev.ports[0];
        this.registerMessageListener(this.messagePort);
      }
    });
  }

  registerMessageListener(messagePort: MessagePort): void {
    messagePort.onmessage = (ev) => {
      this.messages$.next(ev);
    };
  }

  sendMessage(message: any): void {
    this.messagePort?.postMessage(message);
  }
}
