import { describe, it, expect } from 'vitest';
import { mapUPSStatusCode, mapFedExEventType } from '@supabase/functions/webhook-handler/utils';

describe('webhook handler utils', () => {
  it('maps UPS status codes', () => {
    expect(mapUPSStatusCode('I')).toBe('in_transit');
    expect(mapUPSStatusCode('X')).toBe('exception');
    expect(mapUPSStatusCode('Z')).toBe('unknown');
  });

  it('maps FedEx event types', () => {
    expect(mapFedExEventType('DL')).toBe('delivered');
    expect(mapFedExEventType('PU')).toBe('pickup');
    expect(mapFedExEventType('XX')).toBe('unknown');
  });
});
