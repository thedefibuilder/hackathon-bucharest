import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TWalletError } from '~~/lib/errors-mapper';
import type { Abi, Address, Hex, PublicClient, TransactionReceipt, WalletClient } from 'viem';

import { mapWalletErrorsToMessage } from '~~/lib/errors-mapper';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { useChainId, useSwitchNetwork } from 'wagmi';

type TWriteContractResponse = {
  hash: Address;
  receipt: TransactionReceipt;
};

export default function useWriteContract() {
  const activeChainId = useChainId();
  const { chains } = useSwitchNetwork();

  const activeChain = useMemo(
    () => chains.find((chain) => chain.id === activeChainId) ?? chains[0],
    [activeChainId, chains]
  );

  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TWalletError | null>(null);
  const [response, setResponse] = useState<TWriteContractResponse | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const publicClient = createPublicClient({
        chain: activeChain,
        transport: http()
      });

      const walletClient = createWalletClient({
        chain: activeChain,
        transport: custom(window.ethereum)
      });

      setPublicClient(publicClient);
      setWalletClient(walletClient);
    }
  }, [activeChain]);

  const writeContract = useCallback(
    async (abi: Abi, address: Address, functionName: string, arguments_: unknown[]) => {
      if (!publicClient || !walletClient) {
        setIsLoading(false);
        setError({
          title: 'Unexpected error',
          message: 'Something horribly wrong happened with your transaction.'
        });
        setResponse(null);

        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setResponse(null);

        const walletAddresses = await walletClient.getAddresses();
        const walletAddress = walletAddresses.at(0) as Address;

        const { request } = await publicClient.simulateContract({
          chain: activeChain,
          abi,
          address,
          functionName,
          args: arguments_,
          account: walletAddress
        });

        const hash = await walletClient.writeContract(request);
        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        setIsLoading(false);
        setError(null);
        setResponse({
          hash,
          receipt
        });
      } catch (error: unknown) {
        setIsLoading(false);
        setError(mapWalletErrorsToMessage(error));
        setResponse(null);

        console.error('ERROR writeING CONTRACT', error);
      }
    },
    [publicClient, walletClient, activeChain]
  );

  return {
    publicClient,
    isLoading,
    error,
    response,
    writeContract
  };
}
