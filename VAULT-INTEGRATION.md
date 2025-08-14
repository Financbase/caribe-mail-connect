# Vault Integration Guide

This document provides information on how to set up and use HashiCorp Vault for secrets management in this application.

## Prerequisites

- Docker and Docker Compose
- HashiCorp Vault CLI (optional, for local development)
- jq (for JSON processing in scripts)

## Getting Started

### 1. Start the Application with Vault

```bash
docker-compose up -d
```

This will start:
- Vault server (http://localhost:8200)
- PostgreSQL database
- Application services

### 2. Initialize Vault

Vault will be automatically initialized on first run. The initialization script will:
1. Initialize Vault with a single unseal key
2. Enable the KV v2 secrets engine
3. Create an app policy with appropriate permissions
4. Generate an application token
5. Store database credentials in Vault

### 3. Access Vault UI

You can access the Vault UI at: http://localhost:8200

Use the root token (displayed during initialization) to log in.

## Environment Variables

Create a `.env.vault` file in the project root with the following variables:

```
VAULT_ADDR=http://vault:8200
VAULT_TOKEN=your_app_token_here
VAULT_UNSEAL_KEY=your_unseal_key_here
```

## Available Scripts

- `npm run vault:init` - Initialize Vault (run automatically on first start)
- `npm run vault:unseal` - Unseal Vault (run after restart)
- `npm run vault:status` - Check Vault status
- `npm run vault:login` - Log in to Vault CLI

## Secrets Management

### Storing Secrets

Secrets are stored in the KV v2 secrets engine under the path `secret/data/app/`.

Example:
```bash
vault kv put secret/data/app/database/credentials \
  host=db \
  port=5432 \
  database=partner_management \
  user=postgres \
  password=your_secure_password \
  ssl=false
```

### Accessing Secrets in Code

Use the VaultService to access secrets:

```javascript
const VaultService = require('./utils/vault');

// Get a secret
const secret = await VaultService.getSecret('database/credentials');

// Store a secret
await VaultService.setSecret('api/keys', {
  apiKey: 'your-api-key',
  apiSecret: 'your-api-secret'
});
```

## Security Considerations

1. **Never commit sensitive data** to version control
2. Store the root token and unseal key in a secure location
3. In production, use a proper Vault backend (not file storage)
4. Enable TLS for Vault in production
5. Use appropriate policies to restrict access

## Troubleshooting

### Vault is sealed

If you see errors about Vault being sealed, run:

```bash
npm run vault:unseal
```

### Cannot connect to Vault

1. Make sure Vault is running:
   ```bash
   docker-compose ps
   ```

2. Check Vault logs:
   ```bash
   docker-compose logs vault
   ```

3. Verify the VAULT_ADDR and VAULT_TOKEN environment variables are set correctly

## Production Deployment

For production deployments:

1. Use a proper storage backend (Consul, etcd, S3, etc.)
2. Enable TLS
3. Set up auto-unsealing
4. Use a more secure authentication method (AppRole, JWT, etc.)
5. Enable audit logging

## License

This project is licensed under the MIT License.
