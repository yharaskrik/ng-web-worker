export type WorkerFactory = () => Worker;

export interface NgInWorkerConfig {
  workerId: string;
  broadcast: boolean;
  factory?: WorkerFactory;
}
