import { TestBed } from '@angular/core/testing';

import { DatosGPSService } from './datos-gps.service';

describe('DatosGPSService', () => {
  let service: DatosGPSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosGPSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
