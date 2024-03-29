'use client';

import React from 'react';

import { DropdownMenuItem } from '~~/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { useDisconnect } from 'wagmi';

import IconItem from '../icon-item';

export default function Disconnect() {
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenuItem
      className='text-destructive hover:!bg-destructive hover:text-destructive-foreground focus:!bg-destructive focus:text-destructive-foreground'
      onClick={() => disconnect()}
    >
      <IconItem icon={LogOut} text='Disconnect' />
    </DropdownMenuItem>
  );
}
