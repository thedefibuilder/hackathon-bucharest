'use client';

import { useEffect } from 'react';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAnimationConfig } from '~~/hooks/scaffold-eth';
import { notification } from '~~/utils/scaffold-eth';
import { Abi, AbiFunction } from 'abitype';
import { Address } from 'viem';
import { useContractRead } from 'wagmi';

import { InheritanceTooltip } from './InheritanceTooltip';
import { displayTxResult } from './utilsDisplay';

type DisplayVariableProps = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  refreshDisplayVariables: boolean;
  inheritedFrom?: string;
  abi: Abi;
};

export const DisplayVariable = ({
  contractAddress,
  abiFunction,
  refreshDisplayVariables,
  abi,
  inheritedFrom
}: DisplayVariableProps) => {
  const {
    data: result,
    isFetching,
    refetch
  } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    onError: (error) => {
      notification.error(error.message);
    }
  });

  const { showAnimation } = useAnimationConfig(result);

  useEffect(() => {
    refetch();
  }, [refetch, refreshDisplayVariables]);

  return (
    <div className='space-y-1 pb-2'>
      <div className='flex items-center'>
        <h3 className='mb-0 break-all text-lg font-medium'>{abiFunction.name}</h3>
        <button className='btn btn-ghost btn-xs' onClick={async () => await refetch()}>
          {isFetching ? (
            <span className='loading loading-spinner loading-xs'></span>
          ) : (
            <ArrowPathIcon className='h-3 w-3 cursor-pointer' aria-hidden='true' />
          )}
        </button>
        <InheritanceTooltip inheritedFrom={inheritedFrom} />
      </div>
      <div className='flex flex-col items-start font-medium text-gray-500'>
        <div>
          <div
            className={`block break-all bg-transparent transition ${
              showAnimation ? 'animate-pulse-fast rounded-sm bg-warning' : ''
            }`}
          >
            {displayTxResult(result)}
          </div>
        </div>
      </div>
    </div>
  );
};
