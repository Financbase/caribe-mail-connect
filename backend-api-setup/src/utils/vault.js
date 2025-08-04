const vault = require('node-vault');
const { logger } = require('./logger');

// Initialize Vault client with Docker service name as default
const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR || 'http://vault:8200',
  token: process.env.VAULT_TOKEN || 'root-token',
  requestOptions: {
    timeout: 10000, // 10 second timeout
    retry: {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 5000
    }
  }
});

class VaultService {
  /**
   * Store a secret in Vault
   * @param {string} path - Secret path (e.g., 'database/credentials')
   * @param {object} data - Secret data to store
   * @returns {Promise<object>} - Response from Vault
   */
  static async setSecret(path, data) {
    try {
      const secretPath = `secret/data/app/${path}`;
      const result = await vaultClient.write(secretPath, { data });
      logger.info(`Secret stored at path: ${secretPath}`);
      return result;
    } catch (error) {
      logger.error('Error storing secret in Vault:', error);
      throw error;
    }
  }

  /**
   * Retrieve a secret from Vault
   * @param {string} path - Secret path
   * @returns {Promise<object>} - Secret data
   */
  static async getSecret(path) {
    try {
      const secretPath = `secret/data/app/${path}`;
      const result = await vaultClient.read(secretPath);
      return result.data.data;
    } catch (error) {
      if (error.response && error.response.statusCode === 404) {
        logger.warn(`Secret not found at path: ${path}`);
        return null;
      }
      logger.error('Error retrieving secret from Vault:', error);
      throw error;
    }
  }

  /**
   * Delete a secret from Vault
   * @param {string} path - Secret path
   * @returns {Promise<object>} - Response from Vault
   */
  static async deleteSecret(path) {
    try {
      const secretPath = `secret/data/app/${path}`;
      const result = await vaultClient.delete(secretPath);
      logger.info(`Secret deleted from path: ${secretPath}`);
      return result;
    } catch (error) {
      logger.error('Error deleting secret from Vault:', error);
      throw error;
    }
  }

  /**
   * List all secrets at a given path
   * @param {string} path - Base path
   * @returns {Promise<Array>} - List of secrets
   */
  static async listSecrets(path = '') {
    try {
      const secretPath = `secret/metadata/app/${path}`.replace(/\/+$/, '');
      const result = await vaultClient.list(secretPath);
      return result.data.keys || [];
    } catch (error) {
      if (error.response && error.response.statusCode === 404) {
        return [];
      }
      logger.error('Error listing secrets from Vault:', error);
      throw error;
    }
  }
}

module.exports = VaultService;
