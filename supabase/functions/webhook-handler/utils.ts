// Utility mapping functions for webhook handler - Created on 2025-02-14
export function mapUPSStatusCode(statusCode: string): string {
  const statusMap: { [key: string]: string } = {
    I: 'in_transit',
    D: 'delivered',
    X: 'exception',
    P: 'pickup'
  };
  return statusMap[statusCode] || 'unknown';
}

export function mapFedExEventType(eventType: string): string {
  const eventMap: { [key: string]: string } = {
    PU: 'pickup',
    IT: 'in_transit',
    OD: 'out_for_delivery',
    DL: 'delivered',
    EX: 'exception'
  };
  return eventMap[eventType] || 'unknown';
}
