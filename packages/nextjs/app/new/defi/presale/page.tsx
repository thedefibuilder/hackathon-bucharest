'use client';

import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { offeringSchema, TOfferingSchema } from '~~/schemas/offering';
import { useForm } from 'react-hook-form';

import OfferingTab from './_components/tabs/offering';

export default function PresalePage() {
  const [activeTab, setActiveTab] = useState<TPreSaleTab>(preSaleTabs.offering);

  function onContinueClick(tab: TPreSaleTab) {
    setActiveTab(tab);
  }

  const offeringForm = useForm<TOfferingSchema>({
    resolver: zodResolver(offeringSchema),
    defaultValues: {
      token: '',
      payment: '',
      allocationSupply: '0',
      price: '0'
    }
  });

  return (
    <div className='flex h-[calc(100%-2.5rem)] w-full flex-col'>
      <Tabs defaultValue={activeTab} value={activeTab} className='h-full w-full'>
        <TabsList className='mb-2.5 w-full'>
          {Object.values(preSaleTabs).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className='w-1/5'
              disabled={false}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <OfferingTab form={offeringForm} onContinueClick={onContinueClick} />

        {/* <ReviewTab
          identityValues={identityForm.watch()}
          tokenomicsValues={tokenomicsForm.watch()}
          socialsValues={socialsForm.watch()}
          isDeployingErc20={isDeployingErc20}
          onErc20ContractDeploy={onErc20ContractDeploy}
        /> */}
      </Tabs>
    </div>
  );
}
