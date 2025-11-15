# Testing the Messaging System

## Prerequisites

1. **Connect Your Wallet**
   - Click "Connect Wallet" button in the app
   - Select and approve your Sui wallet (e.g., Sui Wallet, Suiet)
   - Make sure you're on **Sui Testnet**

2. **Get Test SUI Tokens**
   - Visit: https://faucet.sui.io/
   - Enter your wallet address
   - Request testnet SUI tokens (needed for blockchain transactions)

## How to Test

### Step 1: Start the Dev Server
```bash
pnpm dev
```

### Step 2: Check Messaging Status

Navigate to the Messages page. You'll see:

- **Loading indicator** (spinning icon) - Session key is being created
- **Green checkmark** (or no warning) - Messaging is ready for blockchain
- **Yellow warning icon** - Messaging is unavailable (will fall back to local storage)

### Step 3: Send a Test Message

**Method 1: Start New Conversation**
1. Click the **"+"** button in Messages page
2. Select a user from the list
3. Type a message and add an emoji using the emoji picker 😊
4. Click Send

**Method 2: Existing Conversation**
1. Click on any conversation in the list
2. Type your message
3. Click Send

### Step 4: Monitor the Console

Open browser DevTools (F12) and check the Console tab for:

```
✅ Success messages:
- "Message sent via blockchain!"

⚠️ Fallback messages:
- "Blockchain message failed, falling back to local"
- "Message sent locally (blockchain unavailable)"

❌ Error messages:
- "Failed to create messaging client"
- "Failed to send message"
```

## Testing Different Scenarios

### Scenario 1: Test With Connected Wallet
1. Connect wallet
2. Wait for session key creation (~2-3 seconds)
3. Send a message
4. Should see blockchain success toast

### Scenario 2: Test Without Wallet
1. Don't connect wallet (or disconnect)
2. Try to send a message
3. Should work with local storage fallback
4. Yellow warning icon should be visible

### Scenario 3: Test Session Key Persistence
1. Send a message (creates session key)
2. Refresh the page
3. Session key should restore from localStorage
4. Check DevTools > Application > Local Storage
5. Look for key: `sessionKey_<your-address>`

### Scenario 4: Test Emoji Picker
1. Click the smile icon in message input
2. Search for emojis (e.g., "happy")
3. Click an emoji to insert it
4. Works in:
   - Messages (MessagesPage)
   - Create Post (CreatePostModal)
   - Post Replies (PostDetailPage)

## Debug Information

### Check Session Key in Console
Open DevTools Console and run:
```javascript
localStorage.getItem('sessionKey_' + 'YOUR_WALLET_ADDRESS')
```

### Check Messaging Client Status
The `useMessaging` hook provides:
- `messagingClient` - The messaging client instance (or null)
- `sessionKey` - The session key instance (or null)
- `isReady` - Boolean indicating if ready for blockchain messaging
- `isLoading` - Boolean indicating if still loading

### Expected Flow

```
1. User connects wallet
   ↓
2. SessionKeyProvider creates/loads session key
   ↓
3. MessagingClientProvider creates messaging client
   ↓
4. useMessaging hook returns isReady: true
   ↓
5. Messages can be sent via blockchain
```

## Common Issues & Solutions

### Issue: "Module not found" errors
**Solution:** Make sure packages are installed:
```bash
pnpm install
```

### Issue: Session key creation fails
**Solution:** 
- Check wallet is connected to testnet
- Check console for specific error messages
- Verify MESSAGING_PACKAGE_ID in SessionKeyProvider.tsx

### Issue: Messages don't send via blockchain
**Solution:**
- Verify you have testnet SUI tokens
- Check network connection
- Look for error messages in console
- System will automatically fall back to local storage

### Issue: Emoji picker doesn't open
**Solution:**
- Check browser console for errors
- Verify emoji-picker-react is installed
- Try clearing browser cache

## Testing the Actual Blockchain Integration

To test real blockchain messaging (not just local fallback):

1. **Update the Package ID** in `src/context/SessionKeyProvider.tsx`:
   ```typescript
   const MESSAGING_PACKAGE_ID = 'YOUR_DEPLOYED_PACKAGE_ID';
   ```

2. **Deploy the Messaging Contract** (if not already done):
   - Follow Sui documentation to deploy messaging contracts
   - Update the package ID

3. **Configure Seal Servers** in `src/context/MessagingClientProvider.tsx`:
   - Verify SEAL_SERVERS array contains correct object IDs
   - These are pre-configured for testnet

4. **Test End-to-End**:
   - Send a message between two different wallets
   - Check transaction on Sui Explorer: https://testnet.suivision.xyz/

## Monitoring

### Check Browser DevTools

**Application Tab:**
- Local Storage: Session keys and local messages
- Network Tab: API calls to Walrus storage

**Console Tab:**
- Session key creation logs
- Message sending logs
- Error messages

### Check Sui Explorer

After sending a message via blockchain:
1. Get your wallet address
2. Visit: https://testnet.suivision.xyz/
3. Search for your address
4. Look for messaging transactions

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Session key creates/restores
- [ ] Messaging status indicator shows correct state
- [ ] Can start new conversation
- [ ] Can send messages
- [ ] Emoji picker opens and inserts emojis
- [ ] Messages display correctly
- [ ] Timestamps show properly
- [ ] Toast notifications appear
- [ ] Local storage fallback works
- [ ] Session key persists after refresh
- [ ] Works on mobile (responsive)

## Need Help?

Check these files for implementation details:
- `src/context/SessionKeyProvider.tsx` - Session key management
- `src/context/MessagingClientProvider.tsx` - Messaging client setup
- `src/hooks/use-messaging.ts` - Messaging hook
- `src/pages/MessagesPage.tsx` - Message UI and sending logic

Look for console logs and error messages for debugging!
