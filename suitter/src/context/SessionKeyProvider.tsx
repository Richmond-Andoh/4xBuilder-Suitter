import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { SessionKey, type ExportedSessionKey } from '@mysten/seal';

interface SessionKeyContextValue {
  sessionKey: SessionKey | null;
  isLoading: boolean;
}

const SessionKeyContext = createContext<SessionKeyContextValue | undefined>(undefined);

export const useSessionKey = (): SessionKeyContextValue => {
  const ctx = useContext(SessionKeyContext);
  if (ctx === undefined) {
    throw new Error('useSessionKey must be used within a SessionKeyProvider');
  }
  return ctx;
};

// Replace this with your actual package ID from your deployment
const MESSAGING_PACKAGE_ID = '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75';
const SESSION_KEY_TTL_MINUTES = 60 * 24 * 7; // 7 days

export const SessionKeyProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [sessionKey, setSessionKey] = useState<SessionKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentAccount?.address) {
      setSessionKey(null);
      setIsLoading(false);
      return;
    }

    const loadOrCreateSessionKey = async () => {
      try {
        setIsLoading(true);
        const storageKey = `sessionKey_${currentAccount.address}`;
        
        // Try to load existing session key from localStorage
        const storedKeyData = localStorage.getItem(storageKey);
        
        if (storedKeyData) {
          try {
            const exportedKey: ExportedSessionKey = JSON.parse(storedKeyData);
            
            // Restore the session key from exported data
            const restoredKey = SessionKey.import(exportedKey, suiClient);
            
            // Check if the key is expired
            if (!restoredKey.isExpired()) {
              setSessionKey(restoredKey);
              return;
            }
            
            // If expired, remove from storage and create a new one
            localStorage.removeItem(storageKey);
          } catch (error) {
            console.error('Failed to restore session key, creating new one:', error);
            localStorage.removeItem(storageKey);
          }
        }
        
        // Create a new session key
        const newSessionKey = await SessionKey.create({
          address: currentAccount.address,
          packageId: MESSAGING_PACKAGE_ID,
          ttlMin: SESSION_KEY_TTL_MINUTES,
          suiClient,
        });
        
        // Export and store the session key
        const exportedKey = newSessionKey.export();
        localStorage.setItem(storageKey, JSON.stringify(exportedKey));
        
        setSessionKey(newSessionKey);
      } catch (error) {
        console.error('Failed to load or create session key:', error);
        setSessionKey(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrCreateSessionKey();
  }, [currentAccount?.address, suiClient]);

  return (
    <SessionKeyContext.Provider value={{ sessionKey, isLoading }}>
      {children}
    </SessionKeyContext.Provider>
  );
};
