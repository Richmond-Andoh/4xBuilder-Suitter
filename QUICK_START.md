# 🚀 Quick Start - Deploy Contract

## Prerequisites Check
✓ Sui CLI installed: `sui --version`
⚠️  Sui client needs initialization

## Quick Steps

1. **Initialize Sui Client:**
   ```bash
   sui client
   # Follow prompts: choose testnet, ed25519
   ```

2. **Get Testnet SUI:**
   ```bash
   sui client faucet
   ```

3. **Deploy Contract:**
   ```bash
   cd suitter-contracts
   ./deploy.sh
   ```

4. **Start Frontend:**
   ```bash
   cd suitter
   pnpm dev
   ```

See `DEPLOYMENT_INSTRUCTIONS.md` for detailed steps.
