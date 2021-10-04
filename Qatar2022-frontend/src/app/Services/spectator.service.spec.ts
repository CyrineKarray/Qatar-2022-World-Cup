import { TestBed } from '@angular/core/testing';

import { SpectatorService } from './spectator.service';

describe('SpectatorService', () => {
  let service: SpectatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpectatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
