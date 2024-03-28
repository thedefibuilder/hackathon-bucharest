'use client';

import React from 'react';

import type { NextPage } from 'next';

import { BugAntIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Address } from '~~/components/scaffold-eth';
import Link from 'next/link';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className='flex flex-grow flex-col items-center pt-10'>
        <div className='px-5'>
          <h1 className='text-center'>
            <span className='mb-2 block text-2xl'>Welcome to</span>
            <span className='block text-4xl font-bold'>Scaffold-ETH 2</span>
          </h1>
          <div className='flex items-center justify-center space-x-2'>
            <p className='my-2 font-medium'>Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className='text-center text-lg'>
            Get started by editing{' '}
            <code className='inline-block max-w-full break-words break-all bg-base-300 text-base font-bold italic'>
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className='text-center text-lg'>
            Edit your smart contract{' '}
            <code className='inline-block max-w-full break-words break-all bg-base-300 text-base font-bold italic'>
              YourContract.sol
            </code>{' '}
            in{' '}
            <code className='inline-block max-w-full break-words break-all bg-base-300 text-base font-bold italic'>
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className='mt-16 w-full flex-grow bg-base-300 px-8 py-12'>
          <div className='flex flex-col items-center justify-center gap-12 sm:flex-row'>
            <div className='flex max-w-xs flex-col items-center rounded-3xl bg-base-100 px-10 py-10 text-center'>
              <BugAntIcon className='h-8 w-8 fill-secondary' />
              <p>
                Tinker with your smart contract using the{' '}
                <Link href='/debug' passHref className='link'>
                  Debug Contracts
                </Link>{' '}
                tab.
              </p>
            </div>
            <div className='flex max-w-xs flex-col items-center rounded-3xl bg-base-100 px-10 py-10 text-center'>
              <MagnifyingGlassIcon className='h-8 w-8 fill-secondary' />
              <p>
                Explore your local transactions with the{' '}
                <Link href='/blockexplorer' passHref className='link'>
                  Block Explorer
                </Link>{' '}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
