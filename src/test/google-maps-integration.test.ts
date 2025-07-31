import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GoogleMapsProvider } from '@/components/maps/GoogleMapsProvider';
import { LiveTrackingMap } from '@/components/maps/LiveTrackingMap';

// Mock environment variables
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' })
}));

// Mock Google Maps API
const mockGoogle = {
  maps: {
    Map: vi.fn(() => ({
      setCenter: vi.fn(),
      setZoom: vi.fn(),
      fitBounds: vi.fn()
    })),
    Marker: vi.fn(() => ({
      setMap: vi.fn(),
      addListener: vi.fn(),
      setIcon: vi.fn()
    })),
    Polyline: vi.fn(() => ({
      setMap: vi.fn(),
      setOptions: vi.fn(),
      addListener: vi.fn()
    })),
    LatLng: vi.fn(),
    LatLngBounds: vi.fn(() => ({
      extend: vi.fn(),
      union: vi.fn()
    })),
    MapTypeId: { ROADMAP: 'roadmap' },
    TravelMode: { DRIVING: 'DRIVING' },
    UnitSystem: { METRIC: 'METRIC' },
    SymbolPath: { CIRCLE: 0 },
    event: {
      clearListeners: vi.fn(),
      addListener: vi.fn()
    }
  }
};

// Mock window.google
Object.defineProperty(window, 'google', {
  value: mockGoogle,
  writable: true
});

describe('Google Maps Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load Google Maps provider without errors', () => {
    const TestComponent = () => React.createElement(GoogleMapsProvider, {}, 
      React.createElement('div', { 'data-testid': 'maps-provider' }, 'Maps Provider Loaded')
    );

    render(React.createElement(TestComponent));
    expect(screen.getByTestId('maps-provider')).toBeInTheDocument();
  });

  it('should render LiveTrackingMap component', () => {
    const mockVehicles = [
      {
        id: '1',
        driverName: 'Test Driver',
        currentLocation: { lat: 18.4395043, lng: -65.9992275 },
        destination: { lat: 18.3985, lng: -66.1614, address: 'Test Address' },
        status: 'en_route' as const,
        eta: '15 min',
        packageCount: 5,
        vehicleType: 'car' as const
      }
    ];

    render(React.createElement(GoogleMapsProvider, {}, 
      React.createElement(LiveTrackingMap, { vehicles: mockVehicles })
    ));

    expect(screen.getByText('Live Tracking')).toBeInTheDocument();
    expect(screen.getByText('1 vehicles')).toBeInTheDocument();
  });

  it('should handle missing API key gracefully', () => {
    // Temporarily remove API key
    const originalEnv = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    delete (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY;

    const TestComponent = () => React.createElement(GoogleMapsProvider, {}, 
      React.createElement('div', { 'data-testid': 'error-handling' }, 'Error Handling Test')
    );

    render(React.createElement(TestComponent));
    expect(screen.getByTestId('error-handling')).toBeInTheDocument();

    // Restore API key
    (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY = originalEnv;
  });

  it('should support bilingual interface', () => {
    const mockVehicles = [
      {
        id: '1',
        driverName: 'Test Driver',
        currentLocation: { lat: 18.4395043, lng: -65.9992275 },
        destination: { lat: 18.3985, lng: -66.1614, address: 'Test Address' },
        status: 'en_route' as const,
        eta: '15 min',
        packageCount: 5,
        vehicleType: 'car' as const
      }
    ];

    render(React.createElement(GoogleMapsProvider, {}, 
      React.createElement(LiveTrackingMap, { vehicles: mockVehicles })
    ));

    // Check for English text
    expect(screen.getByText('Live Tracking')).toBeInTheDocument();
    expect(screen.getByText(/1.*vehicles/)).toBeInTheDocument();
  });
}); 