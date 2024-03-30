'use client';

import React from 'react';

import type { NextPage } from 'next';

import { BugAntIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Address } from '~~/components/scaffold-eth';
import StyledLink from '~~/components/styled-link';
import { ERoutesPath } from '~~/lib/routes';
import Link from 'next/link';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className='flex flex-grow flex-col items-center justify-center pt-10'>
        <div className='px-5'>
          <h1 className='text-center'>
            <span className='mb-2 block text-2xl'>Welcome to</span>
            <span className='block text-4xl font-bold'>Modular Builder</span>
            <span className='block text-xl font-bold text-primary'>by DeFi Builder</span>
          </h1>
        </div>

        <div className='mt-10 flex gap-x-5'>
          <StyledLink href={ERoutesPath.dashboard}>View your Contracts</StyledLink>
          <StyledLink href={ERoutesPath.deployContract}>Deploy New ERC20 Token</StyledLink>
        </div>
      </div>
    </>
  );
};

export default Home;
