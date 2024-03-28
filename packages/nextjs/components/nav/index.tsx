'use client';

import React from 'react';

import Logo from './logo';

export default function Navbar() {
  return (
    <header className='border-border relative flex h-20 w-full justify-between border-b px-5'>
      <nav className='flex h-full items-center gap-x-5'>
        <Logo />
      </nav>
    </header>
  );
}
