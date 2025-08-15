#!/usr/bin/env node

/**
 * PRMCMS System Health Monitor
 * Continuous monitoring of system health and performance metrics
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

class HealthMonitor {
  constructor() {
    this.metrics = [];
    this.alerts = [];
    this.isRunning = false;
    this.intervalId = null;
  }

  async checkDatabaseHealth() {
    const startTime = Date.now();
    try {
      // Test basic connectivity
      const { data, error } = await supabase
        .from('environment_config')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkDataIntegrity() {
    try {
      // Check critical tables
      const checks = await Promise.all([
        supabase.from('mailboxes').select('*', { count: 'exact' }),
        supabase.from('test_users').select('*', { count: 'exact' }),
        supabase.from('environment_config').select('*', { count: 'exact' })
      ]);

      const [mailboxes, users, configs] = checks;
      
      if (mailboxes.error || users.error || configs.error) {
        throw new Error('Data integrity check failed');
      }

      return {
        status: 'healthy',
        counts: {
          mailboxes: mailboxes.count,
          users: users.count,
          configs: configs.count
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkPerformance() {
    const tests = [];
    
    try {
      // Test 1: Simple query
      const start1 = Date.now();
      await supabase.from('mailboxes').select('*').limit(5);
      tests.push({ name: 'simple_query', time: Date.now() - start1 });

      // Test 2: Count query
      const start2 = Date.now();
      await supabase.from('mailboxes').select('*', { count: 'exact' });
      tests.push({ name: 'count_query', time: Date.now() - start2 });

      // Test 3: Complex query
      const start3 = Date.now();
      await supabase.from('environment_config').select('*').eq('environment', 'development');
      tests.push({ name: 'filtered_query', time: Date.now() - start3 });

      const avgTime = tests.reduce((sum, test) => sum + test.time, 0) / tests.length;
      
      return {
        status: avgTime < 500 ? 'healthy' : 'degraded',
        averageResponseTime: avgTime,
        tests,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkEnvironmentSwitching() {
    try {
      // Get current environment
      const { data: current, error } = await supabase
        .from('environment_config')
        .select('config_value')
        .eq('environment', 'system')
        .eq('config_key', 'current_environment')
        .single();

      if (error) throw error;

      // Test switching to a different environment
      const testEnv = current.config_value === 'development' ? 'staging' : 'development';
      
      const { error: updateError } = await supabase
        .from('environment_config')
        .upsert({
          environment: 'system',
          config_key: 'current_environment',
          config_value: testEnv
        }, { onConflict: 'environment,config_key' });

      if (updateError) throw updateError;

      // Switch back
      const { error: revertError } = await supabase
        .from('environment_config')
        .upsert({
          environment: 'system',
          config_key: 'current_environment',
          config_value: current.config_value
        }, { onConflict: 'environment,config_key' });

      if (revertError) throw revertError;

      return {
        status: 'healthy',
        currentEnvironment: current.config_value,
        switchTest: 'passed',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async runHealthCheck() {
    console.log(`🔍 Running health check at ${new Date().toISOString()}`);
    
    const healthCheck = {
      timestamp: new Date().toISOString(),
      environment: process.env.ENVIRONMENT || 'development',
      database: await this.checkDatabaseHealth(),
      dataIntegrity: await this.checkDataIntegrity(),
      performance: await this.checkPerformance(),
      environmentSwitching: await this.checkEnvironmentSwitching()
    };

    // Calculate overall health
    const components = [
      healthCheck.database,
      healthCheck.dataIntegrity,
      healthCheck.performance,
      healthCheck.environmentSwitching
    ];
    
    const healthyCount = components.filter(c => c.status === 'healthy').length;
    const degradedCount = components.filter(c => c.status === 'degraded').length;
    const unhealthyCount = components.filter(c => c.status === 'unhealthy').length;

    if (unhealthyCount > 0) {
      healthCheck.overallStatus = 'unhealthy';
    } else if (degradedCount > 0) {
      healthCheck.overallStatus = 'degraded';
    } else {
      healthCheck.overallStatus = 'healthy';
    }

    healthCheck.summary = {
      healthy: healthyCount,
      degraded: degradedCount,
      unhealthy: unhealthyCount,
      total: components.length
    };

    // Store metrics
    this.metrics.push(healthCheck);

    // Check for alerts
    this.checkAlerts(healthCheck);

    // Log results
    this.logHealthCheck(healthCheck);

    // Save to file
    this.saveMetrics();

    return healthCheck;
  }

  checkAlerts(healthCheck) {
    const alerts = [];

    // Database response time alert
    if (healthCheck.database.responseTime > 1000) {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        message: `Database response time high: ${healthCheck.database.responseTime}ms`,
        timestamp: healthCheck.timestamp
      });
    }

    // Database health alert
    if (healthCheck.database.status === 'unhealthy') {
      alerts.push({
        type: 'availability',
        severity: 'critical',
        message: `Database unhealthy: ${healthCheck.database.error}`,
        timestamp: healthCheck.timestamp
      });
    }

    // Performance alert
    if (healthCheck.performance.status === 'degraded') {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        message: `Performance degraded: ${healthCheck.performance.averageResponseTime}ms average`,
        timestamp: healthCheck.timestamp
      });
    }

    // Data integrity alert
    if (healthCheck.dataIntegrity.status === 'unhealthy') {
      alerts.push({
        type: 'data',
        severity: 'critical',
        message: `Data integrity issue: ${healthCheck.dataIntegrity.error}`,
        timestamp: healthCheck.timestamp
      });
    }

    this.alerts.push(...alerts);

    // Log alerts
    alerts.forEach(alert => {
      const emoji = alert.severity === 'critical' ? '🚨' : '⚠️';
      console.log(`${emoji} ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`);
    });
  }

  logHealthCheck(healthCheck) {
    const status = healthCheck.overallStatus;
    const emoji = status === 'healthy' ? '✅' : status === 'degraded' ? '⚠️' : '❌';
    
    console.log(`${emoji} Overall Status: ${status.toUpperCase()}`);
    console.log(`📊 Components: ${healthCheck.summary.healthy}/${healthCheck.summary.total} healthy`);
    
    if (healthCheck.database.responseTime) {
      console.log(`⚡ DB Response: ${healthCheck.database.responseTime}ms`);
    }
    
    if (healthCheck.performance.averageResponseTime) {
      console.log(`📈 Avg Performance: ${healthCheck.performance.averageResponseTime.toFixed(2)}ms`);
    }
    
    console.log('---');
  }

  saveMetrics() {
    const data = {
      lastUpdated: new Date().toISOString(),
      metrics: this.metrics.slice(-100), // Keep last 100 metrics
      alerts: this.alerts.slice(-50), // Keep last 50 alerts
      summary: this.generateSummary()
    };

    fs.writeFileSync('monitoring/health-metrics.json', JSON.stringify(data, null, 2));
  }

  generateSummary() {
    if (this.metrics.length === 0) return null;

    const recent = this.metrics.slice(-10); // Last 10 checks
    const avgResponseTime = recent.reduce((sum, m) => sum + (m.database.responseTime || 0), 0) / recent.length;
    const healthyPercentage = (recent.filter(m => m.overallStatus === 'healthy').length / recent.length) * 100;

    return {
      checksPerformed: this.metrics.length,
      averageResponseTime: avgResponseTime.toFixed(2),
      healthyPercentage: healthyPercentage.toFixed(1),
      lastCheck: recent[recent.length - 1]?.timestamp,
      totalAlerts: this.alerts.length
    };
  }

  async startMonitoring(intervalMinutes = 5) {
    console.log(`🚀 Starting health monitoring (every ${intervalMinutes} minutes)`);
    this.isRunning = true;

    // Run initial check
    await this.runHealthCheck();

    // Set up interval
    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        await this.runHealthCheck();
      }
    }, intervalMinutes * 60 * 1000);
  }

  stopMonitoring() {
    console.log('🛑 Stopping health monitoring');
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getStatus() {
    const latest = this.metrics[this.metrics.length - 1];
    return {
      isRunning: this.isRunning,
      totalChecks: this.metrics.length,
      totalAlerts: this.alerts.length,
      latestStatus: latest?.overallStatus || 'unknown',
      lastCheck: latest?.timestamp || 'never'
    };
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';

  const monitor = new HealthMonitor();

  try {
    switch (command) {
      case 'check':
        console.log('🔍 Running single health check...');
        const result = await monitor.runHealthCheck();
        console.log('\n📄 Health check complete');
        break;

      case 'monitor':
        const interval = parseInt(args[1]) || 5;
        await monitor.startMonitoring(interval);
        
        // Handle graceful shutdown
        process.on('SIGINT', () => {
          monitor.stopMonitoring();
          process.exit(0);
        });
        
        // Keep process alive
        process.stdin.resume();
        break;

      case 'status':
        const status = monitor.getStatus();
        console.log('📊 Monitor Status:', status);
        break;

      default:
        console.log('PRMCMS Health Monitor');
        console.log('Usage:');
        console.log('  node health-monitor.js check           - Run single health check');
        console.log('  node health-monitor.js monitor [mins]  - Start continuous monitoring');
        console.log('  node health-monitor.js status          - Show monitor status');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default HealthMonitor;
