#!/bin/bash

# Start Vault server in development mode
vault server -config=../vault-config.hcl > ../vault.log 2>&1 &

# Wait for Vault to start
sleep 2

# Set Vault address
export VAULT_ADDR='http://127.0.0.1:8200'

# Initialize Vault if not already initialized
if [ ! -f ".vault-initialized" ]; then
    echo "Initializing Vault..."
    vault operator init -key-shares=1 -key-threshold=1 > vault-keys.txt
    
    # Extract the unseal key and root token
    UNSEAL_KEY=$(grep 'Unseal Key 1:' vault-keys.txt | awk '{print $NF}')
    ROOT_TOKEN=$(grep 'Initial Root Token:' vault-keys.txt | awk '{print $NF}')
    
    # Unseal Vault
    vault operator unseal $UNSEAL_KEY
    
    # Login with root token
    vault login $ROOT_TOKEN
    
    # Enable key-value secrets engine
    vault secrets enable -version=2 -path=secret kv
    
    # Create a policy for our application
    vault policy write app-policy - <<EOF
path "secret/data/app/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF
    
    # Create a token for our application
    APP_TOKEN=$(vault token create -policy=app-policy -format=json | jq -r '.auth.client_token')
    
    # Save tokens to .env.vault file
    echo "VAULT_ADDR=http://127.0.0.1:8200" > .env.vault
    echo "VAULT_TOKEN=$APP_TOKEN" >> .env.vault
    echo "VAULT_UNSEAL_KEY=$UNSEAL_KEY" >> .env.vault
    
    # Mark as initialized
    touch .vault-initialized
    
    echo "Vault initialized and unsealed!"
    echo "Root Token: $ROOT_TOKEN"
    echo "App Token: $APP_TOKEN"
    echo "Unseal Key: $UNSEAL_KEY"
    echo -e "\nIMPORTANT: Save the root token and unseal key in a secure location!"
else
    echo "Vault already initialized. Starting server..."
    vault login $(grep VAULT_TOKEN .env.vault | cut -d '=' -f2)
    vault operator unseal $(grep VAULT_UNSEAL_KEY .env.vault | cut -d '=' -f2)

# Start Vault server in development mode
vault server -config=vault-config.hcl &

# Wait for Vault to start
sleep 2

# Set Vault address
export VAULT_ADDR='http://127.0.0.1:8200'

# Initialize Vault
if [ ! -f ".vault-initialized" ]; then
    echo "Initializing Vault..."
    vault operator init -key-shares=1 -key-threshold=1 > vault-keys.txt
    
    # Extract the unseal key and root token
    UNSEAL_KEY=$(grep 'Unseal Key 1:' vault-keys.txt | awk '{print $NF}')
    ROOT_TOKEN=$(grep 'Initial Root Token:' vault-keys.txt | awk '{print $NF}')
    
    # Unseal Vault
    vault operator unseal $UNSEAL_KEY
    
    # Login with root token
    vault login $ROOT_TOKEN
    
    # Enable key-value secrets engine
    vault secrets enable -version=2 kv
    
    # Create a policy for our application
    vault policy write app-policy - <<EOF
path "secret/data/app/*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}
EOF
    
    # Create a token for our application
    APP_TOKEN=$(vault token create -policy=app-policy -format=json | jq -r '.auth.client_token')
    
    # Save tokens to .env file
    echo "VAULT_ADDR=http://127.0.0.1:8200" > .env.vault
    echo "VAULT_TOKEN=$APP_TOKEN" >> .env.vault
    echo "VAULT_UNSEAL_KEY=$UNSEAL_KEY" >> .env.vault
    
    # Mark as initialized
    touch .vault-initialized
    
    echo "Vault initialized and unsealed!"
    echo "Root Token: $ROOT_TOKEN"
    echo "App Token: $APP_TOKEN"
    echo "Unseal Key: $UNSEAL_KEY"
    echo "
IMPORTANT: Save the root token and unseal key in a secure location!"
else
    echo "Vault already initialized. Starting server..."
    vault login $(grep VAULT_TOKEN .env.vault | cut -d '=' -f2)
    vault operator unseal $(grep VAULT_UNSEAL_KEY .env.vault | cut -d '=' -f2)
fi
