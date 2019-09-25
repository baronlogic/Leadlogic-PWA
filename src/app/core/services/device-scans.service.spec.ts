import { TestBed } from '@angular/core/testing';

import { DeviceScansService } from './device-scans.service';

describe('DeviceScansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceScansService = TestBed.get(DeviceScansService);
    expect(service).toBeTruthy();
  });
});
