'use client';

import React from 'react';

import useActivePath from '~~/hooks/use-active-path';

import CLink from './link';

const paths = [
  {
    name: 'Home',
    href: '/'
  },
  {
    name: 'Contracts',
    href: '/contracts'
  },
  {
    name: 'New',
    href: '/new/token/erc20'
  }
];

export default function SecondaryNav() {
  const checkActivePath = useActivePath();

  return (
    <nav className='flex w-full items-center gap-x-2.5 px-5 py-2.5'>
      {paths.map((path) => (
        <CLink
          key={path.name}
          href={path.href}
          className={`btn ${checkActivePath(path.href) ? 'btn-secondary' : 'btn-primary'}`}
        >
          {path.name}
        </CLink>
      ))}
    </nav>
  );
}
