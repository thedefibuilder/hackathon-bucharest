import type { NextPage } from 'next';

import { getMetadata } from '~~/utils/scaffold-eth/getMetadata';

import { DebugContracts } from './_components/DebugContracts';

export const metadata = getMetadata({
  title: 'Debug Contracts',
  description: 'Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way'
});

const Debug: NextPage = () => {
  return (
    <>
      <DebugContracts />
      <div className='mt-8 bg-secondary p-10 text-center'>
        <h1 className='my-0 text-4xl'>Debug Contracts</h1>
        <p className='text-neutral'>
          You can debug & interact with your deployed contracts here.
          <br /> Check{' '}
          <code className='bg-base-300 px-1 text-base font-bold italic [word-spacing:-0.5rem]'>
            packages / nextjs / app / debug / page.tsx
          </code>{' '}
        </p>
      </div>
    </>
  );
};

export default Debug;
