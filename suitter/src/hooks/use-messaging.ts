import { useMessagingClient } from '@/context/MessagingClientProvider';
import { useSessionKey } from '@/context/SessionKeyProvider';
import { useCurrentAccount } from '@mysten/dapp-kit';

export const useMessaging = () => {
  const messagingClient = useMessagingClient();
  const { sessionKey, isLoading: isSessionKeyLoading } = useSessionKey();
  const currentAccount = useCurrentAccount();

  const isReady = !!(messagingClient && sessionKey && currentAccount);

  return {
    messagingClient,
    sessionKey,
    currentAccount,
    isReady,
    isLoading: isSessionKeyLoading,
  };
};
