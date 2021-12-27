import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { PortService } from '@ng-web-worker/worker';

@Injectable()
export class IntervalService {
  readonly interval$ = interval(1000);

  constructor(private portService: PortService) {
    this.interval$.subscribe((i) =>
      this.portService.sendMessage({ event: 'interval', payload: i })
    );
  }
}
