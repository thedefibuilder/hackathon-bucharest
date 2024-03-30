/* eslint-disable unicorn/filename-case */

import React from 'react';

import { HeartIcon } from '@heroicons/react/24/outline';

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className='mb-11 min-h-0 px-1 py-5 lg:mb-0'>
      <div className='w-full'>
        <ul className='menu menu-horizontal w-full'>
          <div className='flex w-full items-center justify-center gap-2 text-sm'>
            <div className='flex items-center justify-center gap-2'>
              <p className='m-0 text-center'>
                Built with <HeartIcon className='inline-block h-4 w-4' /> at
              </p>
              <span className='font-bold'>ETH Bucharest</span>
              <span>by the</span>
              <span className='font-bold'>DeFi Builder</span>
              <span>team</span>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
