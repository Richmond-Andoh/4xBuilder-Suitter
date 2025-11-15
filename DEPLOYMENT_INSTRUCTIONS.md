# Quick Deployment Instructions

## Step 1: Initialize Sui Client (One-time setup)

Since your Sui client isn't initialized yet, run these commands:

```bash
# Initialize Sui client (will prompt you - choose testnet and ed25519)
sui client

# When prompted:
# - Choose "y" to connect to Sui Full node server
# - Use default testnet URL: https://fullnode.testnet.sui.io:443
# - Choose key scheme: 0 (for ed25519)

# OR manually create address:
sui client new-address ed25519

# Switch to testnet
sui client switch --env testnet
```

If testnet doesn't exist, create it first:

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

## Step 2: Get Testnet SUI (for gas fees)

```bash
sui client faucet
```

This will give you testnet SUI coins for gas fees.

## Step 3: Deploy the Contract

You have two options:

### Option A: Use the deployment script (Recommended)

```bash
cd suitter-contracts
./deploy.sh
```

The script will:
- Build the contract
- Deploy to testnet
- Extract the Package ID
- Update the `.env` file automatically

### Option B: Manual deployment

```bash
cd suitter-contracts/suitter

# Build the contract
sui move build

# Deploy to testnet
sui client publish --gas-budget 100000000
```

After deployment, look for the output like:

```
Published Objects:
  PackageID: 0xabc123def456...  <-- Copy this!
```

## Step 4: Update Environment Variables

If you used the script, it's already done! Otherwise:

1. Create `.env` file in the `suitter/` directory:

```bash
cd suitter
cp .env.example .env  # If .env.example exists
# OR create .env manually
```

2. Add the Package ID to `.env`:

```env
VITE_SUI_NETWORK=testnet
VITE_SUITTER_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
```

Replace `0xYOUR_PACKAGE_ID_HERE` with the Package ID from step 3.

## Step 5: Start the Frontend

```bash
cd suitter
pnpm install  # If not already done
pnpm dev
```

## Verification

After deployment, verify your package:

```bash
# Check package exists
sui client object <PACKAGE_ID>

# Check active network
sui client active-env

# Check active address
sui client active-address
```

## Troubleshooting

### "Insufficient gas"
```bash
sui client faucet  # Get more testnet SUI
```

### "Package ID not found in output"
The Package ID is in the "Published Objects" section. Look for a line starting with `PackageID:`

### "Client not initialized"
Run `sui client` and follow the prompts to set up your first address and network.

---

**Note:** The Package ID is permanent once deployed. Save it somewhere safe!

