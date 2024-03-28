/* eslint-disable unicorn/filename-case */

'use client';

import React, { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDarkMode = resolvedTheme === 'dark';

  const handleToggle = () => {
    if (isDarkMode) {
      setTheme('light');
      return;
    }
    setTheme('dark');
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex h-8 items-center justify-center space-x-2 text-sm ${className}`}>
      <input
        id='theme-toggle'
        type='checkbox'
        className='toggle toggle-primary border-primary bg-primary hover:bg-primary'
        onChange={handleToggle}
        checked={isDarkMode}
      />
      {
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
          htmlFor='theme-toggle'
          className={`swap swap-rotate ${isDarkMode ? '' : 'swap-active'}`}
        >
          <SunIcon className='swap-on h-5 w-5' />
          <MoonIcon className='swap-off h-5 w-5' />
        </label>
      }
    </div>
  );
};
