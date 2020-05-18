import { TestBed } from '@angular/core/testing';

import { DeviceScansService } from './device-scans.service';

describe('DeviceScansService', () => {
  let service: DeviceScansService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceScansService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
