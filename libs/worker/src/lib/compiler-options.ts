import { CompilerOptions } from '@angular/core';

/**
 * The subset of compiler options that matter for running Angular within a webworker.
 *
 * All the other flags are unneeded as they are either irrelevant or they are DOM related
 */
export type WebWorkerCompilerOptions = Pick<CompilerOptions, 'providers'>;
