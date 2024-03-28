/* eslint-disable unicorn/filename-case */

import React from 'react';

import { CurrencyDollarIcon, HeartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BuidlGuidlLogo } from '~~/components/assets/BuidlGuidlLogo';
import { Faucet } from '~~/components/scaffold-eth';
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork';
import { useGlobalState } from '~~/services/store/store';
import Link from 'next/link';
import { hardhat } from 'viem/chains';

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState((state) => state.nativeCurrencyPrice);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <div className='mb-11 min-h-0 px-1 py-5 lg:mb-0'>
      <div>
        <div className='pointer-events-none fixed bottom-0 left-0 z-10 flex w-full items-center justify-between p-4'>
          <div className='pointer-events-auto flex flex-col gap-2 md:flex-row'>
            {nativeCurrencyPrice > 0 && (
              <div>
                <div className='btn btn-primary btn-sm cursor-auto gap-1 font-normal'>
                  <CurrencyDollarIcon className='h-4 w-4' />
                  <span>{nativeCurrencyPrice}</span>
                </div>
              </div>
            )}
            {isLocalNetwork && (
              <>
                <Faucet />
                <Link
                  href='/blockexplorer'
                  passHref
                  className='btn btn-primary btn-sm gap-1 font-normal'
                >
                  <MagnifyingGlassIcon className='h-4 w-4' />
                  <span>Block Explorer</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='w-full'>
        <ul className='menu menu-horizontal w-full'>
          <div className='flex w-full items-center justify-center gap-2 text-sm'>
            <div className='text-center'>
              <a
                href='https://github.com/scaffold-eth/se-2'
                target='_blank'
                rel='noreferrer'
                className='link'
              >
                Fork me
              </a>
            </div>
            <span>·</span>
            <div className='flex items-center justify-center gap-2'>
              <p className='m-0 text-center'>
                Built with <HeartIcon className='inline-block h-4 w-4' /> at
              </p>
              <a
                className='flex items-center justify-center gap-1'
                href='https://buidlguidl.com/'
                target='_blank'
                rel='noreferrer'
              >
                <BuidlGuidlLogo className='h-5 w-3 pb-1' />
                <span className='link'>BuidlGuidl</span>
              </a>
            </div>
            <span>·</span>
            <div className='text-center'>
              <a
                href='https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA'
                target='_blank'
                rel='noreferrer'
                className='link'
              >
                Support
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
