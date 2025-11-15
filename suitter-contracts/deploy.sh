#!/bin/bash

# Suitter Smart Contract Deployment Script
# This script deploys the Suitter contract to Sui testnet

set -e

echo "🚀 Suitter Smart Contract Deployment"
echo "===================================="
echo ""

# Navigate to contract directory
cd "$(dirname "$0")/suitter"

# Check if Sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Error: Sui CLI is not installed"
    echo "Install it from: https://docs.sui.io/guides/developer/getting-started/getting-started"
    exit 1
fi

echo "✓ Sui CLI found: $(sui --version)"
echo ""

# Check if client is configured
if [ ! -f "$HOME/.sui/sui_config/client.yaml" ]; then
    echo "⚠️  Sui client not configured yet"
    echo "Please run the following commands first:"
    echo ""
    echo "  sui client new-address ed25519"
    echo "  sui client switch --env testnet"
    echo ""
    echo "Or if testnet doesn't exist:"
    echo "  sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443"
    echo "  sui client switch --env testnet"
    echo ""
    read -p "Have you already configured the client? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please configure the client first, then run this script again."
        exit 1
    fi
fi

# Build the contract
echo "📦 Building contract..."
sui move build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✓ Build successful!"
echo ""

# Check active environment
echo "🌐 Active network:"
sui client active-env
echo ""

# Get active address
ACTIVE_ADDRESS=$(sui client active-address)
echo "📍 Active address: $ACTIVE_ADDRESS"
echo ""

# Check balance
echo "💰 Checking balance..."
BALANCE=$(sui client balance | head -n 1 | awk '{print $1}')
echo "Current balance: $BALANCE SUI"
echo ""

# Deploy the contract
echo "🚀 Deploying contract to testnet..."
echo "This may take a minute..."
echo ""

PUBLISH_OUTPUT=$(sui client publish --gas-budget 100000000 --json)

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    echo "$PUBLISH_OUTPUT"
    exit 1
fi

# Extract Package ID from output
PACKAGE_ID=$(echo "$PUBLISH_OUTPUT" | grep -o '"published":\s*\["[^"]*"' | grep -o '"[^"]*"' | head -n 1 | tr -d '"')

if [ -z "$PACKAGE_ID" ]; then
    # Try alternative parsing
    PACKAGE_ID=$(echo "$PUBLISH_OUTPUT" | grep -o '"packageId":\s*"[^"]*"' | grep -o '"[^"]*"' | head -n 1 | tr -d '"')
fi

if [ -z "$PACKAGE_ID" ]; then
    echo "⚠️  Could not automatically extract Package ID from output"
    echo "Please check the output above and find the Package ID manually"
    echo ""
    echo "$PUBLISH_OUTPUT" | jq '.' 2>/dev/null || echo "$PUBLISH_OUTPUT"
else
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Package ID: $PACKAGE_ID"
    echo ""
    
    # Update .env file
    ENV_FILE="../../suitter/.env"
    
    if [ ! -f "$ENV_FILE" ]; then
        echo "📝 Creating .env file..."
        cat > "$ENV_FILE" << EOF
# Sui Network Configuration
VITE_SUI_NETWORK=testnet

# Suitter Smart Contract Package ID
VITE_SUITTER_PACKAGE_ID=$PACKAGE_ID
EOF
    else
        echo "📝 Updating .env file..."
        # Update or add Package ID
        if grep -q "VITE_SUITTER_PACKAGE_ID" "$ENV_FILE"; then
            # Update existing
            sed -i.bak "s|VITE_SUITTER_PACKAGE_ID=.*|VITE_SUITTER_PACKAGE_ID=$PACKAGE_ID|" "$ENV_FILE"
            rm -f "$ENV_FILE.bak"
        else
            # Add new
            echo "" >> "$ENV_FILE"
            echo "# Suitter Smart Contract Package ID" >> "$ENV_FILE"
            echo "VITE_SUITTER_PACKAGE_ID=$PACKAGE_ID" >> "$ENV_FILE"
        fi
    fi
    
    echo "✅ Updated $ENV_FILE with Package ID"
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Start the frontend: cd ../../suitter && pnpm dev"
    echo "2. Connect your wallet in the browser"
    echo "3. Create a profile and start posting!"
fi

