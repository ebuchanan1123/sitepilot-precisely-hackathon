export interface GeocodeResult {
  latitude: number;
  longitude: number;
  label: string;
}

function hashValue(value: string): number {
  return value.split('').reduce((accumulator, char) => accumulator + char.charCodeAt(0), 0);
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  const normalized = address.trim();
  const hash = hashValue(normalized || 'global');

  return {
    latitude: Number((((hash % 180) - 90) + 0.1234).toFixed(4)),
    longitude: Number((((hash * 3) % 360) - 180 + 0.5678).toFixed(4)),
    label: normalized || 'No location provided',
  };
}
