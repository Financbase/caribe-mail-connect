#!/usr/bin/env node

require('dotenv').config();
const VaultService = require('../src/utils/vault');
const { logger } = require('../src/utils/logger');

async function storeCredentials() {
  try {
    const credentials = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };

    // Validate required fields
    const requiredFields = ['host', 'database', 'user', 'password'];
    const missingFields = requiredFields.filter(field => !credentials[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required database credentials: ${missingFields.join(', ')}`);
    }

    // Store in Vault
    await VaultService.setSecret('database/credentials', credentials);
    
    logger.info('Database credentials successfully stored in Vault');
    console.log('✅ Database credentials successfully stored in Vault');
    
  } catch (error) {
    logger.error('Error storing database credentials in Vault:', error);
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
storeCredentials();
