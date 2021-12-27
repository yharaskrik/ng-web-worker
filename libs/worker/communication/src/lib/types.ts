import { Observable, Subject } from 'rxjs';

export interface MessageEventPayload<T = any> {
  worker: string;
  context: 'ng-web-worker';
  event: string;
  payload: T;
}

export type NgWorkerEvent = MessageEvent<MessageEventPayload>;

export type SendMessagePayload<T = any> = Omit<
  MessageEventPayload<T>,
  'worker' | 'context'
>;

export interface NgWebWorkerCommunication {
  stream(): Observable<NgWorkerEvent>;

  registerMessageListener(port: MessagePort | BroadcastChannel): void;

  sendMessage<T = any>(message: SendMessagePayload<T>): void;
}
