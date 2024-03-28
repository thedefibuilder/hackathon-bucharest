'use client';

import React from 'react';

import StyledLink from '~~/components/styled-link';
import { Separator } from '~~/components/ui/separator';
import useActivePath from '~~/hooks/use-active-path';
import { routes } from '~~/lib/routes';
import { cn } from '~~/lib/utils';

import Logo from './logo';

export default function Navbar() {
  const checkActivePath = useActivePath();

  return (
    <header className='border-border relative flex h-20 w-full justify-between border-b px-5'>
      <nav className='flex h-full items-center gap-x-5'>
        <Logo />
        <Separator orientation='vertical' className='hidden h-[65%] w-0.5 rounded-md lg:block' />

        <ul
          className={cn(
            'border-border bg-background/80 absolute left-0 top-[4.4rem] z-10 hidden w-full flex-col gap-y-5 rounded-b-md border p-5 backdrop-blur-md lg:static lg:flex lg:w-fit lg:flex-row lg:gap-x-5 lg:border-0 lg:p-0'
          )}
        >
          {routes.map((route) => (
            <li key={route.name}>
              <StyledLink
                variant='link'
                href={route.path}
                className={cn('text-base font-medium text-primary', {
                  underline: checkActivePath(route.path)
                })}
              >
                {route.name}
              </StyledLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
