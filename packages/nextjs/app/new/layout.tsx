'use client';

import React, { PropsWithChildren } from 'react';

import Sidebar from '~~/components/sidebar';
import StyledLink from '~~/components/styled-link';
import useActivePath from '~~/hooks/use-active-path';

const paths = {
  Tokens: [
    {
      name: 'ERC20',
      href: '/new/token/erc20'
    }
  ],
  DeFi: [
    {
      name: 'Airstream',
      href: '/new/defi/airstream'
    },
    {
      name: 'Presale',
      href: '/new/defi/presale'
    }
  ]
};

type TNewLayout = PropsWithChildren;

export default function NewLayout({ children }: TNewLayout) {
  const checkActivePath = useActivePath();

  return (
    <div className='flex flex-1 gap-x-5'>
      <Sidebar className='w-52 gap-y-5'>
        {Object.entries(paths).map((entry) => (
          <div key={entry[0]} className='flex flex-col gap-y-1.5'>
            <p className='font-semibold'>{entry[0]}</p>

            {entry[1].map((path) => (
              <StyledLink
                key={path.name}
                href={path.href}
                variant={checkActivePath(path.href) ? 'default' : 'secondary'}
                className='ml-1.5'
              >
                {path.name}
              </StyledLink>
            ))}
          </div>
        ))}
      </Sidebar>

      <section className='w-full'>{children}</section>
    </div>
  );
}
