import { TestBed } from '@angular/core/testing';

import { LogStreamService } from './log-stream.service';

describe('LogStreamService', () => {
  let service: LogStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
