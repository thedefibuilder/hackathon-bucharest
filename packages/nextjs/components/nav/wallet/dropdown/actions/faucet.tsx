'use client';

import React, { useMemo } from 'react';

import { DropdownMenuItem } from '~~/components/ui/dropdown-menu';
import { Coins } from 'lucide-react';
import Link from 'next/link';
import { useChainId, useSwitchNetwork } from 'wagmi';

import IconItem from '../icon-item';

const FAUCET_URL = 'https://www.alchemy.com/faucets';

export default function Faucet() {
  const activeChainId = useChainId();
  const { chains } = useSwitchNetwork();

  const activeChain = useMemo(
    () => chains.find((chain) => chain.id === activeChainId),
    [activeChainId, chains]
  );
  const isActiveChainTestnet = useMemo(() => !!activeChain?.testnet, [activeChain]);

  if (!isActiveChainTestnet) {
    return null;
  }

  return (
    <DropdownMenuItem>
      <Link href={FAUCET_URL} target='_blank' className='cursor-default'>
        <IconItem icon={Coins} text='Faucet' />
      </Link>
    </DropdownMenuItem>
  );
}
