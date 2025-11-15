# Suitter Smart Contract Deployment Guide

## Prerequisites

1. Sui CLI installed (you already have it: `sui 1.52.2`)
2. Sui wallet or address with testnet SUI for gas fees

## Quick Deployment Steps

### 1. Initialize Sui Client (First Time Only)

If you haven't initialized Sui CLI before, you need to set it up:

```bash
cd suitter-contracts/suitter

# Option 1: Create new address (will prompt for key scheme - choose 0 for ed25519)
sui client new-address ed25519

# Option 2: If you already have a wallet, switch to testnet
sui client switch --env testnet
```

If testnet environment doesn't exist, create it:

```bash
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

### 2. Get Testnet SUI (if needed)

```bash
# Request testnet SUI from faucet
sui client faucet
```

### 3. Build the Contract (Optional - for verification)

```bash
cd suitter-contracts/suitter
sui move build
```

### 4. Deploy the Contract

```bash
cd suitter-contracts/suitter
sui client publish --gas-budget 100000000
```

### 5. Extract Package ID

After deployment, you'll see output like:

```
Transaction Digest: 0x...
Published Objects:
  - PackageID: 0x...  <-- This is what you need!
```

Copy the Package ID.

### 6. Update Environment Variables

Create or update `.env` file in the `suitter/` directory:

```env
VITE_SUI_NETWORK=testnet
VITE_SUITTER_PACKAGE_ID=0xYOUR_PACKAGE_ID_HERE
```

Replace `0xYOUR_PACKAGE_ID_HERE` with the actual Package ID from step 5.

## Alternative: Deploy with Specific Network

```bash
# For testnet
sui client publish --gas-budget 100000000 --network testnet

# For devnet
sui client publish --gas-budget 100000000 --network devnet

# For mainnet (be careful!)
sui client publish --gas-budget 100000000 --network mainnet
```

## Verification

After deployment, you can verify the package:

```bash
# Check package details
sui client object <PACKAGE_ID>

# View transaction details
sui client tx-block <TRANSACTION_DIGEST>
```

## Troubleshooting

### "Config file doesn't exist"
- Run `sui client` and follow the prompts to initialize
- Choose testnet when prompted for network

### "Insufficient gas"
- Request testnet SUI: `sui client faucet`
- Or transfer SUI to your address

### "Package ID not found"
- Check the deployment transaction output
- Look for "Published Objects" section
- The Package ID starts with `0x`

## Important Notes

1. **Package ID is permanent** - Once deployed, it never changes
2. **Testnet deployments** - Use testnet for testing, mainnet for production
3. **Gas budget** - 100000000 is usually enough, increase if deployment fails
4. **Network consistency** - Make sure `.env` network matches deployment network

## Example Deployment Output

```
UPDATING GIT DEPENDENCY https://github.com/MystenLabs/sui.git
BUILDING suitter
Successfully verified dependencies on-chain against source.
Transaction Kind : Publish
----- Transaction Digest ----
0xabc123...
----- Transaction Effects ----
Status : Success
Created Objects:
  0xdef456...
Mutated Objects:
  0x789ghi...
Published Objects:
  PackageID: 0x1234567890abcdef...  <-- USE THIS AS PACKAGE ID
----- Events ----
Object 0xdef456... created
```

Copy the `PackageID` value and update your `.env` file!

