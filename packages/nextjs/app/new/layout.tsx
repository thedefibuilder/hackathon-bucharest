'use client';

import React, { PropsWithChildren } from 'react';

import CLink from '~~/components/link';
import Sidebar from '~~/components/sidebar';
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
    <div className='flex'>
      <Sidebar>
        {Object.entries(paths).map((entry) => (
          <div key={entry[0]} className='flex flex-col gap-y-1.5'>
            <p className='font-semibold'>{entry[0]}</p>

            {entry[1].map((path) => (
              <CLink
                key={path.name}
                href={path.href}
                className={`btn ${checkActivePath(path.href) ? 'btn-secondary' : 'btn-primary'}`}
              >
                {path.name}
              </CLink>
            ))}
          </div>
        ))}
      </Sidebar>

      <section>{children}</section>
    </div>
  );
}
