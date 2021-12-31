export interface MessageEventPayload<T = any> {
  workerId: string;
  context: 'ng-web-worker';
  event: string;
  payload: T;
}

export type NgInWorkerEvent = MessageEvent<MessageEventPayload>;

export type SendMessagePayload<T = any> = Omit<
  MessageEventPayload<T>,
  'workerId' | 'context'
>;
