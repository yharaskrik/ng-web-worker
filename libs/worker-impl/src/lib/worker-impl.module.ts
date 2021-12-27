import { DoBootstrap, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntervalService } from './interval.service';

@NgModule({
  imports: [CommonModule],
  providers: [IntervalService],
})
export class WorkerImplModule implements DoBootstrap {
  constructor(private intervalService: IntervalService) {}

  ngDoBootstrap(): void {
    console.log('ngDoBootstrap');
  }
}
