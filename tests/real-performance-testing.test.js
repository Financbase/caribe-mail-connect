/**
 * Real Performance Testing Suite
 * Measures actual execution times, memory usage, and resource consumption
 * NO MOCKS - Real performance measurements only
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { performance } from 'perf_hooks';
import crypto from 'crypto';

// Real Supabase configuration
const SUPABASE_URL = 'https://bunikaxkvghzudpraqjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bmlrYXhrdmdoenVkcHJhcWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NDMyODUsImV4cCI6MjA2OTUxOTI4NX0.K4uKk_wWq0-XHWYYkXha7GJQuWi0cqLiGRH_vYOOMME';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Performance measurement utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  startTimer(operation) {
    this.metrics[operation] = {
      startTime: performance.now(),
      startMemory: process.memoryUsage()
    };
  }

  endTimer(operation) {
    if (!this.metrics[operation]) {
      throw new Error(`Timer for operation '${operation}' was not started`);
    }

    const endTime = performance.now();
    const endMemory = process.memoryUsage();
    const metric = this.metrics[operation];

    return {
      duration: endTime - metric.startTime,
      memoryDelta: {
        rss: endMemory.rss - metric.startMemory.rss,
        heapUsed: endMemory.heapUsed - metric.startMemory.heapUsed,
        heapTotal: endMemory.heapTotal - metric.startMemory.heapTotal,
        external: endMemory.external - metric.startMemory.external
      },
      startMemory: metric.startMemory,
      endMemory: endMemory
    };
  }

  async measureOperation(operation, asyncFunction) {
    this.startTimer(operation);
    const result = await asyncFunction();
    const metrics = this.endTimer(operation);
    return { result, metrics };
  }
}

// Test data generators
const generateUniqueId = () => `PERF-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

describe('Real Performance Testing - Database Operations', () => {
  let monitor;
  let testDataIds = [];

  beforeAll(async () => {
    monitor = new PerformanceMonitor();
    console.log('⚡ Initializing real performance testing...');
    
    // Baseline connection test
    const { result, metrics } = await monitor.measureOperation('connection-test', async () => {
      return await supabase.from('packages').select('count', { count: 'exact', head: true });
    });

    if (result.error) {
      throw new Error(`Database connection failed: ${result.error.message}`);
    }

    console.log(`✅ Connection established in ${metrics.duration.toFixed(2)}ms`);
    console.log(`📊 Memory usage: ${(metrics.endMemory.heapUsed / 1024 / 1024).toFixed(2)}MB`);
  });

  afterAll(async () => {
    // Clean up with performance monitoring
    console.log('🧹 Cleaning up performance test data...');
    
    if (testDataIds.length > 0) {
      const { metrics } = await monitor.measureOperation('cleanup', async () => {
        return await supabase.from('packages').delete().in('id', testDataIds);
      });
      
      console.log(`✅ Cleanup completed in ${metrics.duration.toFixed(2)}ms`);
    }
  });

  test('Performance: Single package CRUD operations timing', async () => {
    const perfId = generateUniqueId();
    console.log(`⏱️ Measuring CRUD performance: ${perfId}`);

    // CREATE performance
    const packageData = {
      tracking_number: `${perfId}-CREATE`,
      carrier: 'UPS',
      customer_name: 'Performance Test Customer',
      customer_email: `perf-${Date.now()}@test.com`,
      status: 'received',
      weight: '2.5 lbs',
      dimensions: '12x8x6 in',
      notes: 'Performance test package'
    };

    const { result: createResult, metrics: createMetrics } = await monitor.measureOperation('create-package', async () => {
      return await supabase.from('packages').insert([packageData]).select();
    });

    expect(createResult.error).toBeNull();
    expect(createResult.data).toHaveLength(1);
    
    const packageId = createResult.data[0].id;
    testDataIds.push(packageId);

    console.log(`📦 CREATE: ${createMetrics.duration.toFixed(2)}ms, Memory: ${(createMetrics.memoryDelta.heapUsed / 1024).toFixed(2)}KB`);
    
    // Performance assertions for CREATE
    expect(createMetrics.duration).toBeLessThan(2000); // Should complete within 2 seconds
    expect(createMetrics.memoryDelta.heapUsed).toBeLessThan(10 * 1024 * 1024); // Less than 10MB memory increase

    // READ performance
    const { result: readResult, metrics: readMetrics } = await monitor.measureOperation('read-package', async () => {
      return await supabase.from('packages').select('*').eq('id', packageId).single();
    });

    expect(readResult.error).toBeNull();
    expect(readResult.data.id).toBe(packageId);

    console.log(`📖 READ: ${readMetrics.duration.toFixed(2)}ms, Memory: ${(readMetrics.memoryDelta.heapUsed / 1024).toFixed(2)}KB`);
    
    // Performance assertions for READ
    expect(readMetrics.duration).toBeLessThan(1000); // Should complete within 1 second
    expect(readMetrics.memoryDelta.heapUsed).toBeLessThan(5 * 1024 * 1024); // Less than 5MB memory increase

    // UPDATE performance
    const { result: updateResult, metrics: updateMetrics } = await monitor.measureOperation('update-package', async () => {
      return await supabase
        .from('packages')
        .update({ status: 'processing', notes: 'Updated for performance test' })
        .eq('id', packageId)
        .select();
    });

    expect(updateResult.error).toBeNull();
    expect(updateResult.data).toHaveLength(1);
    expect(updateResult.data[0].status).toBe('processing');

    console.log(`📝 UPDATE: ${updateMetrics.duration.toFixed(2)}ms, Memory: ${(updateMetrics.memoryDelta.heapUsed / 1024).toFixed(2)}KB`);
    
    // Performance assertions for UPDATE
    expect(updateMetrics.duration).toBeLessThan(1500); // Should complete within 1.5 seconds
    expect(updateMetrics.memoryDelta.heapUsed).toBeLessThan(5 * 1024 * 1024); // Less than 5MB memory increase

    // DELETE performance
    const { result: deleteResult, metrics: deleteMetrics } = await monitor.measureOperation('delete-package', async () => {
      return await supabase.from('packages').delete().eq('id', packageId).select();
    });

    expect(deleteResult.error).toBeNull();
    expect(deleteResult.data).toHaveLength(1);

    console.log(`🗑️ DELETE: ${deleteMetrics.duration.toFixed(2)}ms, Memory: ${(deleteMetrics.memoryDelta.heapUsed / 1024).toFixed(2)}KB`);
    
    // Performance assertions for DELETE
    expect(deleteMetrics.duration).toBeLessThan(1500); // Should complete within 1.5 seconds
    expect(deleteMetrics.memoryDelta.heapUsed).toBeLessThan(5 * 1024 * 1024); // Less than 5MB memory increase

    // Remove from cleanup list since we deleted it
    testDataIds = testDataIds.filter(id => id !== packageId);

    console.log(`✅ CRUD performance test completed`);
  });

  test('Performance: Bulk operations with real load testing', async () => {
    const perfId = generateUniqueId();
    const bulkSize = 50; // Test with 50 records
    console.log(`📊 Measuring bulk operations performance: ${bulkSize} records`);

    // Generate bulk test data
    const bulkData = Array.from({ length: bulkSize }, (_, index) => ({
      tracking_number: `${perfId}-BULK-${index.toString().padStart(3, '0')}`,
      carrier: ['UPS', 'FedEx', 'USPS', 'DHL'][index % 4],
      customer_name: `Bulk Customer ${index}`,
      customer_email: `bulk-${index}-${Date.now()}@test.com`,
      status: ['received', 'processing', 'ready'][index % 3],
      weight: `${(Math.random() * 10 + 1).toFixed(1)} lbs`,
      dimensions: `${Math.floor(Math.random() * 20 + 5)}x${Math.floor(Math.random() * 20 + 5)}x${Math.floor(Math.random() * 20 + 5)} in`,
      notes: `Bulk test package ${index}`
    }));

    // BULK INSERT performance
    const { result: bulkInsertResult, metrics: bulkInsertMetrics } = await monitor.measureOperation('bulk-insert', async () => {
      return await supabase.from('packages').insert(bulkData).select();
    });

    expect(bulkInsertResult.error).toBeNull();
    expect(bulkInsertResult.data).toHaveLength(bulkSize);
    
    // Store IDs for cleanup
    bulkInsertResult.data.forEach(pkg => testDataIds.push(pkg.id));

    console.log(`📦 BULK INSERT (${bulkSize}): ${bulkInsertMetrics.duration.toFixed(2)}ms, Memory: ${(bulkInsertMetrics.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    // Performance assertions for bulk insert
    expect(bulkInsertMetrics.duration).toBeLessThan(10000); // Should complete within 10 seconds
    expect(bulkInsertMetrics.memoryDelta.heapUsed).toBeLessThan(50 * 1024 * 1024); // Less than 50MB memory increase

    // BULK READ performance
    const { result: bulkReadResult, metrics: bulkReadMetrics } = await monitor.measureOperation('bulk-read', async () => {
      return await supabase
        .from('packages')
        .select('*')
        .ilike('tracking_number', `%${perfId}-BULK%`)
        .order('created_at', { ascending: false });
    });

    expect(bulkReadResult.error).toBeNull();
    expect(bulkReadResult.data).toHaveLength(bulkSize);

    console.log(`📖 BULK READ (${bulkSize}): ${bulkReadMetrics.duration.toFixed(2)}ms, Memory: ${(bulkReadMetrics.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    // Performance assertions for bulk read
    expect(bulkReadMetrics.duration).toBeLessThan(5000); // Should complete within 5 seconds
    expect(bulkReadMetrics.memoryDelta.heapUsed).toBeLessThan(30 * 1024 * 1024); // Less than 30MB memory increase

    // BULK UPDATE performance (update status of all records)
    const packageIds = bulkInsertResult.data.map(pkg => pkg.id);
    const { result: bulkUpdateResult, metrics: bulkUpdateMetrics } = await monitor.measureOperation('bulk-update', async () => {
      return await supabase
        .from('packages')
        .update({ status: 'delivered', notes: 'Bulk updated for performance test' })
        .in('id', packageIds)
        .select();
    });

    expect(bulkUpdateResult.error).toBeNull();
    expect(bulkUpdateResult.data).toHaveLength(bulkSize);
    expect(bulkUpdateResult.data.every(pkg => pkg.status === 'delivered')).toBe(true);

    console.log(`📝 BULK UPDATE (${bulkSize}): ${bulkUpdateMetrics.duration.toFixed(2)}ms, Memory: ${(bulkUpdateMetrics.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    
    // Performance assertions for bulk update
    expect(bulkUpdateMetrics.duration).toBeLessThan(8000); // Should complete within 8 seconds
    expect(bulkUpdateMetrics.memoryDelta.heapUsed).toBeLessThan(40 * 1024 * 1024); // Less than 40MB memory increase

    console.log(`✅ Bulk operations performance test completed`);
  });

  test('Performance: Search and filter operations under load', async () => {
    const perfId = generateUniqueId();
    console.log(`🔍 Measuring search performance: ${perfId}`);

    // Create test data for searching (if not already created by previous tests)
    const searchTestData = Array.from({ length: 20 }, (_, index) => ({
      tracking_number: `${perfId}-SEARCH-${index.toString().padStart(3, '0')}`,
      carrier: ['UPS', 'FedEx', 'USPS'][index % 3],
      customer_name: `Search Customer ${String.fromCharCode(65 + (index % 26))}`,
      customer_email: `search-${index}-${Date.now()}@test.com`,
      status: ['received', 'processing', 'ready', 'delivered'][index % 4]
    }));

    const { result: searchDataResult } = await monitor.measureOperation('search-data-setup', async () => {
      return await supabase.from('packages').insert(searchTestData).select();
    });

    expect(searchDataResult.error).toBeNull();
    searchDataResult.data.forEach(pkg => testDataIds.push(pkg.id));

    // Test 1: Simple text search performance
    const { result: textSearchResult, metrics: textSearchMetrics } = await monitor.measureOperation('text-search', async () => {
      return await supabase
        .from('packages')
        .select('*')
        .ilike('tracking_number', `%${perfId}-SEARCH%`);
    });

    expect(textSearchResult.error).toBeNull();
    expect(textSearchResult.data.length).toBeGreaterThan(0);

    console.log(`🔤 TEXT SEARCH: ${textSearchMetrics.duration.toFixed(2)}ms, Results: ${textSearchResult.data.length}`);
    expect(textSearchMetrics.duration).toBeLessThan(2000); // Should complete within 2 seconds

    // Test 2: Complex filter performance
    const { result: complexFilterResult, metrics: complexFilterMetrics } = await monitor.measureOperation('complex-filter', async () => {
      return await supabase
        .from('packages')
        .select('*')
        .ilike('tracking_number', `%${perfId}-SEARCH%`)
        .in('status', ['received', 'processing'])
        .in('carrier', ['UPS', 'FedEx'])
        .order('created_at', { ascending: false });
    });

    expect(complexFilterResult.error).toBeNull();

    console.log(`🔧 COMPLEX FILTER: ${complexFilterMetrics.duration.toFixed(2)}ms, Results: ${complexFilterResult.data.length}`);
    expect(complexFilterMetrics.duration).toBeLessThan(3000); // Should complete within 3 seconds

    // Test 3: Pagination performance
    const { result: paginationResult, metrics: paginationMetrics } = await monitor.measureOperation('pagination', async () => {
      return await supabase
        .from('packages')
        .select('*')
        .ilike('tracking_number', `%${perfId}-SEARCH%`)
        .range(0, 9) // First 10 results
        .order('created_at', { ascending: false });
    });

    expect(paginationResult.error).toBeNull();
    expect(paginationResult.data.length).toBeLessThanOrEqual(10);

    console.log(`📄 PAGINATION: ${paginationMetrics.duration.toFixed(2)}ms, Results: ${paginationResult.data.length}`);
    expect(paginationMetrics.duration).toBeLessThan(1500); // Should complete within 1.5 seconds

    console.log(`✅ Search performance test completed`);
  });

  test('Performance: Concurrent operations stress test', async () => {
    const perfId = generateUniqueId();
    const concurrentCount = 20;
    console.log(`⚡ Measuring concurrent operations: ${concurrentCount} simultaneous requests`);

    // Test concurrent reads
    const readPromises = Array.from({ length: concurrentCount }, (_, index) =>
      monitor.measureOperation(`concurrent-read-${index}`, async () => {
        return await supabase
          .from('packages')
          .select('*')
          .limit(10)
          .order('created_at', { ascending: false });
      })
    );

    const concurrentStartTime = performance.now();
    const readResults = await Promise.all(readPromises);
    const concurrentEndTime = performance.now();
    const totalConcurrentTime = concurrentEndTime - concurrentStartTime;

    // Verify all operations succeeded
    readResults.forEach((result, index) => {
      expect(result.result.error).toBeNull();
      console.log(`📖 Concurrent Read ${index}: ${result.metrics.duration.toFixed(2)}ms`);
    });

    const avgReadTime = readResults.reduce((sum, result) => sum + result.metrics.duration, 0) / concurrentCount;
    const maxReadTime = Math.max(...readResults.map(result => result.metrics.duration));
    const minReadTime = Math.min(...readResults.map(result => result.metrics.duration));

    console.log(`📊 CONCURRENT READS SUMMARY:`);
    console.log(`   Total Time: ${totalConcurrentTime.toFixed(2)}ms`);
    console.log(`   Average Time: ${avgReadTime.toFixed(2)}ms`);
    console.log(`   Min Time: ${minReadTime.toFixed(2)}ms`);
    console.log(`   Max Time: ${maxReadTime.toFixed(2)}ms`);

    // Performance assertions for concurrent operations
    expect(totalConcurrentTime).toBeLessThan(15000); // All operations within 15 seconds
    expect(avgReadTime).toBeLessThan(3000); // Average operation within 3 seconds
    expect(maxReadTime).toBeLessThan(5000); // No single operation over 5 seconds

    console.log(`✅ Concurrent operations stress test completed`);
  });
});
