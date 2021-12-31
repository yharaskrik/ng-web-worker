import { Observable } from 'rxjs';
import {
  NgInWorkerEvent,
  SendMessagePayload,
} from '@ng-web-worker/worker/core';

export interface NgWebWorkerCommunication {
  stream(): Observable<NgInWorkerEvent>;

  registerMessageListener(port: MessagePort | BroadcastChannel): void;

  sendMessage<T = any>(message: SendMessagePayload<T>): void;
}
