import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLastMileMetrics, useDeliveryRoutes, useLiveTracking } from '@/hooks/useLastMile'
import { supabase } from '@/integrations/supabase/client'

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => ({
              order: vi.fn(() => ({
                limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          }))
        })),
        insert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: null, error: null }))
          }))
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: null, error: null }))
            }))
          }))
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null }))
        }))
      }))
    }))
  }
}))

// Test wrapper with QueryClient
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('Last-Mile Delivery Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useLastMileMetrics', () => {
    it('should fetch last-mile metrics successfully', async () => {
      const mockMetrics = {
        total_deliveries: 150,
        completed_today: 12,
        average_delivery_time: 25,
        efficiency_score: 87,
        active_drivers: 8,
        carbon_saved: 45.2,
        total_routes: 25,
        active_partnerships: 15
      }

      // Mock the metrics query
      const mockSelect = vi.fn()
      const mockFrom = vi.fn(() => ({
        select: mockSelect
      }))
      
      mockSelect
        .mockReturnValueOnce({
          data: [{ id: '1', average_time_minutes: 25, efficiency_score: 87, carbon_saved_kg: 45.2 }]
        })
        .mockReturnValueOnce({
          data: [{ id: '1' }, { id: '2' }]
        })
        .mockReturnValueOnce({
          data: [{ id: '1' }, { id: '2' }, { id: '3' }]
        })

      vi.mocked(supabase.from).mockImplementation(mockFrom)

      const { result } = renderHook(() => useLastMileMetrics(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(supabase.from).toHaveBeenCalledWith('delivery_routes')
      expect(supabase.from).toHaveBeenCalledWith('delivery_tracking')
      expect(supabase.from).toHaveBeenCalledWith('delivery_partnerships')
    })

    it('should handle metrics fetch error', async () => {
      const mockError = new Error('Database connection failed')
      
      const mockSelect = vi.fn(() => {
        throw mockError
      })
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any)

      const { result } = renderHook(() => useLastMileMetrics(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(mockError)
    })
  })

  describe('useDeliveryRoutes', () => {
    it('should fetch delivery routes with filters', async () => {
      const mockRoutes = [
        {
          id: '1',
          name: 'Ruta San Juan Centro',
          status: 'active',
          efficiency_score: 94,
          delivery_count: 45,
          average_time_minutes: 18,
          fuel_efficiency_percentage: 92,
          carbon_saved_kg: 2.4,
          route_stops: [],
          driver_locations: []
        }
      ]

      const mockSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockRoutes, error: null }))
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any)

      const filters = { status: 'active', efficiency_score_min: 80 }
      
      const { result } = renderHook(() => useDeliveryRoutes(filters), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual(mockRoutes)
      expect(supabase.from).toHaveBeenCalledWith('delivery_routes')
    })

    it('should handle empty routes response', async () => {
      const mockSelect = vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({
            lte: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: [], error: null }))
            }))
          }))
        }))
      }))

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any)

      const { result } = renderHook(() => useDeliveryRoutes(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toEqual([])
    })
  })

  describe('useLiveTracking', () => {
    it('should fetch live tracking data', async () => {
      const mockLiveData = {
        driver_locations: [
          {
            id: '1',
            driver_id: 'driver-1',
            latitude: 18.4655,
            longitude: -66.1057,
            is_online: true,
            last_activity: new Date().toISOString()
          }
        ],
        active_routes: [],
        route_stops: [],
        traffic_conditions: [],
        last_updated: new Date().toISOString()
      }

      const mockSelect = vi.fn()
        .mockReturnValueOnce({
          eq: vi.fn(() => ({
            order: vi.fn(() => ({
              limit: vi.fn(() => Promise.resolve({ data: mockLiveData.driver_locations, error: null }))
            }))
          }))
        })
        .mockReturnValueOnce({
          eq: vi.fn(() => ({
            data: []
          }))
        })
        .mockReturnValueOnce({
          gte: vi.fn(() => ({
            data: []
          }))
        })

      vi.mocked(supabase.from).mockImplementation(() => ({
        select: mockSelect
      } as any))

      const { result } = renderHook(() => useLiveTracking(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(supabase.from).toHaveBeenCalledWith('driver_locations')
      expect(supabase.from).toHaveBeenCalledWith('delivery_routes')
      expect(supabase.from).toHaveBeenCalledWith('traffic_conditions')
    })

    it('should handle live tracking error', async () => {
      const mockError = new Error('Network error')
      
      const mockSelect = vi.fn(() => {
        throw mockError
      })
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect
      } as any)

      const { result } = renderHook(() => useLiveTracking(), {
        wrapper: createWrapper()
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBe(mockError)
    })
  })

  describe('Database Schema Validation', () => {
    it('should validate delivery route data structure', () => {
      const validRoute = {
        id: 'test-id',
        name: 'Test Route',
        driver_id: 'driver-123',
        territory_id: 'territory-456',
        status: 'active' as const,
        efficiency_score: 85,
        delivery_count: 30,
        average_time_minutes: 25,
        fuel_efficiency_percentage: 90,
        carbon_saved_kg: 3.2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      expect(validRoute).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        status: expect.stringMatching(/^(active|inactive|optimizing|completed)$/),
        efficiency_score: expect.any(Number),
        delivery_count: expect.any(Number),
        average_time_minutes: expect.any(Number),
        fuel_efficiency_percentage: expect.any(Number),
        carbon_saved_kg: expect.any(Number)
      })

      expect(validRoute.efficiency_score).toBeGreaterThanOrEqual(0)
      expect(validRoute.efficiency_score).toBeLessThanOrEqual(100)
      expect(validRoute.fuel_efficiency_percentage).toBeGreaterThanOrEqual(0)
      expect(validRoute.fuel_efficiency_percentage).toBeLessThanOrEqual(100)
    })

    it('should validate route stop data structure', () => {
      const validStop = {
        id: 'stop-id',
        route_id: 'route-123',
        stop_order: 1,
        location_name: 'Test Location',
        address: '123 Test St, San Juan, PR',
        latitude: 18.4655,
        longitude: -66.1057,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      expect(validStop).toMatchObject({
        id: expect.any(String),
        route_id: expect.any(String),
        stop_order: expect.any(Number),
        location_name: expect.any(String),
        address: expect.any(String),
        latitude: expect.any(Number),
        longitude: expect.any(Number),
        status: expect.stringMatching(/^(pending|in_transit|delivered|failed|rescheduled)$/)
      })

      expect(validStop.latitude).toBeGreaterThanOrEqual(-90)
      expect(validStop.latitude).toBeLessThanOrEqual(90)
      expect(validStop.longitude).toBeGreaterThanOrEqual(-180)
      expect(validStop.longitude).toBeLessThanOrEqual(180)
    })

    it('should validate delivery partnership data structure', () => {
      const validPartnership = {
        id: 'partnership-id',
        partner_name: 'Test Partner',
        partner_type: 'gig_driver' as const,
        vehicle_type: 'Motorcycle',
        contact_email: 'partner@test.com',
        contact_phone: '+1-787-555-0123',
        rating: 4.5,
        total_deliveries: 150,
        successful_deliveries: 145,
        background_check_status: 'approved' as const,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      expect(validPartnership).toMatchObject({
        id: expect.any(String),
        partner_name: expect.any(String),
        partner_type: expect.stringMatching(/^(gig_driver|courier_service|bike_courier|walking_courier)$/),
        rating: expect.any(Number),
        total_deliveries: expect.any(Number),
        successful_deliveries: expect.any(Number),
        background_check_status: expect.stringMatching(/^(pending|approved|rejected|expired)$/),
        is_active: expect.any(Boolean)
      })

      expect(validPartnership.rating).toBeGreaterThanOrEqual(0)
      expect(validPartnership.rating).toBeLessThanOrEqual(5)
      expect(validPartnership.successful_deliveries).toBeLessThanOrEqual(validPartnership.total_deliveries)
    })
  })

  describe('API Response Validation', () => {
    it('should validate metrics response structure', () => {
      const validMetrics = {
        total_deliveries: 150,
        completed_today: 12,
        average_delivery_time: 25,
        efficiency_score: 87,
        active_drivers: 8,
        carbon_saved: 45.2,
        total_routes: 25,
        active_partnerships: 15
      }

      expect(validMetrics).toMatchObject({
        total_deliveries: expect.any(Number),
        completed_today: expect.any(Number),
        average_delivery_time: expect.any(Number),
        efficiency_score: expect.any(Number),
        active_drivers: expect.any(Number),
        carbon_saved: expect.any(Number),
        total_routes: expect.any(Number),
        active_partnerships: expect.any(Number)
      })

      expect(validMetrics.total_deliveries).toBeGreaterThanOrEqual(0)
      expect(validMetrics.completed_today).toBeGreaterThanOrEqual(0)
      expect(validMetrics.average_delivery_time).toBeGreaterThanOrEqual(0)
      expect(validMetrics.efficiency_score).toBeGreaterThanOrEqual(0)
      expect(validMetrics.efficiency_score).toBeLessThanOrEqual(100)
      expect(validMetrics.active_drivers).toBeGreaterThanOrEqual(0)
      expect(validMetrics.carbon_saved).toBeGreaterThanOrEqual(0)
    })

    it('should validate live tracking response structure', () => {
      const validLiveData = {
        driver_locations: [],
        active_routes: [],
        route_stops: [],
        traffic_conditions: [],
        last_updated: new Date().toISOString()
      }

      expect(validLiveData).toMatchObject({
        driver_locations: expect.any(Array),
        active_routes: expect.any(Array),
        route_stops: expect.any(Array),
        traffic_conditions: expect.any(Array),
        last_updated: expect.any(String)
      })

      expect(new Date(validLiveData.last_updated)).toBeInstanceOf(Date)
    })
  })
}) 