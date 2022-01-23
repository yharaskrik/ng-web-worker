export type WorkerFactory = (name: string) => Worker;

export interface RegisterWorkerConfig {
  workerId: string;
  factory: WorkerFactory;
  initialize?: boolean;
}

export interface NgInWorkerConfig {
  instanceId: string;
  share: boolean;
  debug?: boolean;
  initializeWorkers?: boolean;
  workers?: RegisterWorkerConfig[];
}

export const defaultNgInWorkerConfig: Omit<
  NgInWorkerConfig,
  'instanceId' | 'share'
> = {
  initializeWorkers: false,
  debug: true,
};
