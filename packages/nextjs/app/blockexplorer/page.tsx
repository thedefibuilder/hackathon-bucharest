'use client';

import { useEffect } from 'react';

import type { NextPage } from 'next';

import { useFetchBlocks } from '~~/hooks/scaffold-eth';
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork';
import { notification } from '~~/utils/scaffold-eth';
import { hardhat } from 'viem/chains';

import { PaginationButton, SearchBar, TransactionsTable } from './_components';

const BlockExplorer: NextPage = () => {
  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage, error } =
    useFetchBlocks();
  const { targetNetwork } = useTargetNetwork();

  useEffect(() => {
    if (targetNetwork.id === hardhat.id && error) {
      notification.error(
        <>
          <p className='mb-1 mt-0 font-bold'>Cannot connect to local provider</p>
          <p className='m-0'>
            - Did you forget to run{' '}
            <code className='bg-base-300 text-base font-bold italic'>yarn chain</code> ?
          </p>
          <p className='mt-1 break-normal'>
            - Or you can change{' '}
            <code className='bg-base-300 text-base font-bold italic'>targetNetwork</code> in{' '}
            <code className='bg-base-300 text-base font-bold italic'>scaffold.config.ts</code>
          </p>
        </>
      );
    }

    if (targetNetwork.id !== hardhat.id) {
      notification.error(
        <>
          <p className='mb-1 mt-0 font-bold'>
            <code className='bg-base-300 text-base font-bold italic'> targeNetwork </code> is not
            localhost
          </p>
          <p className='m-0'>
            - You are on{' '}
            <code className='bg-base-300 text-base font-bold italic'>{targetNetwork.name}</code>{' '}
            .This block explorer is only for{' '}
            <code className='bg-base-300 text-base font-bold italic'>localhost</code>.
          </p>
          <p className='mt-1 break-normal'>
            - You can use{' '}
            <a className='text-accent' href={targetNetwork.blockExplorers?.default.url}>
              {targetNetwork.blockExplorers?.default.name}
            </a>{' '}
            instead
          </p>
        </>
      );
    }
  }, [error, targetNetwork]);

  return (
    <div className='container mx-auto my-10'>
      <SearchBar />
      <TransactionsTable blocks={blocks} transactionReceipts={transactionReceipts} />
      <PaginationButton
        currentPage={currentPage}
        totalItems={Number(totalBlocks)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default BlockExplorer;
