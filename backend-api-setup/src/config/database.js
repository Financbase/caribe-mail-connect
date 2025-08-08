const { Pool } = require('pg');
const { logger } = require('../utils/logger');
const VaultService = require('../utils/vault');

// Default database configuration (will be overridden by Vault or environment)
let dbConfig = {
  host: process.env.DB_HOST || 'db', // Default to Docker service name
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'partner_management',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_secure_password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_POOL_MAX || '20', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '2000', 10)
};

// Connection pool instance
let pool;
let isVaultInitialized = false;

// Initialize database configuration from Vault or use environment variables
async function initializeFromVault() {
  if (isVaultInitialized) return;
  
  try {
    // Only attempt to load from Vault if VAULT_TOKEN is set
    if (process.env.VAULT_TOKEN) {
      logger.info('Attempting to load database configuration from Vault...');
      
      // Add a timeout to prevent hanging if Vault is not available
      const secret = await Promise.race([
        VaultService.getSecret('database/credentials'),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Vault connection timeout')), 5000)
        )
      ]);
      
      if (secret) {
        // Only update config with values that exist in the secret
        Object.keys(secret).forEach(key => {
          if (secret[key] !== undefined) {
            dbConfig[key] = secret[key];
          }
        });
        logger.info('Successfully loaded database configuration from Vault');
      } else {
        logger.warn('No database configuration found in Vault, using environment variables');
      }
    } else {
      logger.warn('VAULT_TOKEN not set, using environment variables for database configuration');
    }
  } catch (error) {
    logger.warn(`Failed to load configuration from Vault: ${error.message}. Using environment variables.`);
    // Continue with environment variables as fallback
  } finally {
    isVaultInitialized = true;
  }
  
  // Log final configuration (without sensitive data)
  const { password, ...safeConfig } = dbConfig;
  logger.info('Final database configuration:', safeConfig);
}

// Initialize and get the database connection pool
async function getPool() {
  if (!pool) {
    try {
      // First try to load from Vault if not already initialized
      if (!isVaultInitialized) {
        await initializeFromVault();
        isVaultInitialized = true;
      }
      
      logger.info('Creating database connection pool with config:', {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        user: dbConfig.user,
        ssl: !!dbConfig.ssl,
        max: dbConfig.max
      });
      
      // Create new pool with current configuration
      pool = new Pool(dbConfig);
      
      // Test the connection
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      logger.info('Successfully connected to the database');
      
      // Handle connection errors
      pool.on('error', (err) => {
        logger.error('Unexpected error on idle client', err);
        process.exit(-1);
      });
      
    } catch (error) {
      logger.error('Failed to connect to the database:', error);
      throw error;
    }
  }
  
  return pool;
}

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
const missingVars = requiredEnvVars.filter(varname => !process.env[varname]);

if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  logger.error(`Missing required database environment variables: ${missingVars.join(', ')}`);
  throw new Error('Missing required database configuration');
}

// Log connection events (will be set up when pool is created)
// These event handlers are now set up in the getPool() function

// Test the database connection
const testConnection = async () => {
  try {
    const pool = await getPool();
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    logger.info('Successfully connected to the database');
    return true;
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    return false;
  }
};

// Export the database interface
module.exports = {
  // Get a connection pool (lazy initialization)
  getPool,
  
  // Test the database connection
  testConnection,
  
  // Execute a query
  query: async (text, params) => {
    const pool = await getPool();
    return pool.query(text, params);
  },
  
  // Get a client from the pool
  getClient: async () => {
    const poolInstance = await getPool();
    const client = await poolInstance.connect();
    const query = client.query;
    const release = client.release;
    
    // Set a timeout of 5 seconds
    const timeout = setTimeout(() => {
      logger.error('A client has been checked out for more than 5 seconds!', {
        service: 'database',
        operation: 'clientCheckout',
        duration: '5000ms',
        lastQuery: client.lastQuery ? JSON.stringify(client.lastQuery) : 'No query executed'
      });
    }, 5000);
    
    // Store the original query method
    const originalQuery = client.query;
    
    // Monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      // Store a safe representation of the query for logging
      client.lastQuery = {
        text: typeof args[0] === 'string' ? args[0] : 'Prepared statement',
        values: args[1] ? '***REDACTED***' : 'No params'
      };
      return originalQuery.apply(client, args);
    };
    
    client.release = () => {
      // Clear the timeout
      clearTimeout(timeout);
      
      // Set the methods back to their old un-monkey-patched version
      client.query = query;
      client.release = release;
      return release.apply(client);
    };
    
    return client;
  },
};
