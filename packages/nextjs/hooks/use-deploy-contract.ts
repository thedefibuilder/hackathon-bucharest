import { useCallback, useEffect, useMemo, useState } from 'react';

import type { TWalletError } from '~~/lib/errors-mapper';
import type { Abi, Address, Hex, PublicClient, TransactionReceipt, WalletClient } from 'viem';

import erc20Artifact from '~~/assets/artifacts/ERC20.json';
import { mapWalletErrorsToMessage } from '~~/lib/errors-mapper';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { useChainId, useSwitchNetwork } from 'wagmi';

type TWriteContractResponse = {
  hash: Address;
  receipt: TransactionReceipt;
};

export default function useDeployContract() {
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

  const deployContract = useCallback(
    async (
      abi: Abi,
      bytecode: Hex,
      arguments_: unknown[],
      preApprove?: boolean,
      approveToken?: Address,
      approveAmount?: bigint
    ) => {
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

        // @ts-ignore
        const hash = await walletClient.deployContract({
          abi,
          bytecode,
          args: arguments_,
          account: walletAddress
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        const contractAddress = receipt.contractAddress ?? '';

        if (preApprove) {
          const { request, result } = await publicClient.simulateContract({
            chain: activeChain,
            abi: erc20Artifact.abi as Abi,
            address: approveToken as Address,
            functionName: 'transfer',
            args: [contractAddress, approveAmount],
            account: walletClient.account ?? walletAddress
          });

          if (!result) {
            throw new Error('Failed to pre-approve contract');
          }

          const txHash = await walletClient.writeContract(request);
          await publicClient.waitForTransactionReceipt({ hash: txHash });
        }

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

        console.error('ERROR DEPLOYING CONTRACT', error);
      }
    },
    [publicClient, walletClient, activeChain]
  );

  return {
    publicClient,
    isLoading,
    error,
    response,
    deployContract
  };
}
