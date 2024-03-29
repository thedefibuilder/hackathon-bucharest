/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable indent */

'use client';

import React, { useEffect, useState } from 'react';

import { Deployment, Token } from '@prisma/client';
import StyledLink from '~~/components/styled-link';
import { Skeleton } from '~~/components/ui/skeleton';
import { ERoutesPath } from '~~/lib/routes';
import { useAccount } from 'wagmi';

const ARBITRUM_ID = 421_614;
const BASE_ID = 84_532;

type TDeployment = Deployment & {
  token: Token;
};

export default function ContractsPage() {
  const { isConnected, address } = useAccount();

  const [isFetchingDeployments, setIsFetchingDeployments] = useState(false);
  const [isDeploymentsError, setIsDeploymentsError] = useState(false);
  const [deployments, setDeployments] = useState<TDeployment[] | null>(null);

  useEffect(() => {
    async function fetchDeployments() {
      try {
        setIsFetchingDeployments(true);
        setIsDeploymentsError(false);
        setDeployments(null);

        const response = await fetch(`/api/tokens?wallet-address=${address}`);

        if (!response.ok) {
          setIsDeploymentsError(true);
        }

        const responseJson = await response.json();

        let deployments: TDeployment[] = [];

        if (responseJson && typeof responseJson === 'object') {
          Object.values(responseJson).map((value) => {
            deployments.push(value as TDeployment);
          });

          setDeployments(deployments);
          setIsFetchingDeployments(false);
        }

        console.log('deployments', deployments);
      } catch (error: unknown) {
        setIsDeploymentsError(true);
        setIsFetchingDeployments(false);
        setDeployments(null);

        console.error('ERROR GETTING DEPLOYMENTS LIST', error);
      }
    }

    if (isConnected) {
      fetchDeployments();
    }
  }, [isConnected, address]);

  return (
    <div className='flex h-full w-full flex-col'>
      <h1 className='mb-5 text-2xl font-bold'>Your Active Contracts</h1>

      {isConnected ? (
        <div className='flex flex-col gap-y-5'>
          <OnChainDeployedContracts
            chain='Arbitrum'
            isFetching={isFetchingDeployments}
            deployments={deployments?.filter((deployment) => deployment.chainId === ARBITRUM_ID)}
          />
          <OnChainDeployedContracts
            chain='Base'
            isFetching={isFetchingDeployments}
            deployments={deployments?.filter((deployment) => deployment.chainId === BASE_ID)}
          />
        </div>
      ) : (
        <h2 className='text-xl'>Connect Your Wallet</h2>
      )}
    </div>
  );
}

type TOnChainDeployedContracts = {
  chain: string;
  isFetching: boolean;
  deployments: TDeployment[] | undefined;
};

function OnChainDeployedContracts({ chain, isFetching, deployments }: TOnChainDeployedContracts) {
  const randomIndex = Math.floor(Math.random() * (5 - 1 + 1)) + 1;

  return (
    <div className='flex flex-col gap-y-2'>
      <h2 className='text-lg'>{chain}</h2>
      <ul className='flex h-1/2 w-full gap-x-2.5'>
        {isFetching ? (
          Array.from({ length: randomIndex }).map((_, index) => (
            <Skeleton key={index} className='h-20 w-1/5' />
          ))
        ) : deployments?.length === 0 ? (
          <div className='flex flex-col gap-y-1.5'>
            <h2>No Contracts Deployed On This Chain</h2>
            <StyledLink href={ERoutesPath.deployContract}>Deploy</StyledLink>
          </div>
        ) : (
          deployments?.map((deployment) => (
            <li
              key={deployment.id}
              className='flex w-1/5 flex-col rounded-md border border-border p-2'
            >
              <div className='flex flex-col gap-y-2'>
                <div className='font-semibold'>
                  <span>{deployment.token.name}</span> | <span>{deployment.token.symbol}</span>
                </div>
                <span className='w-fit rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground'>
                  {deployment.template}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
