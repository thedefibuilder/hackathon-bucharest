'use client';

import React, { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { offeringSchema, TOfferingSchema } from '~~/schemas/offering';
import { requirementsSchema, TRequirementsSchema } from '~~/schemas/requirements';
import { TVestingSchema, vestingSchema } from '~~/schemas/vesting';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';

import OfferingTab from './_components/tabs/offering';
import RequirementsTab from './_components/tabs/requirements';
import VestingTab from './_components/tabs/vesting';

export default function PresalePage() {
  const [activeTab, setActiveTab] = useState<TPreSaleTab>(preSaleTabs.offering);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });

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

  const requirementsForm = useForm<TRequirementsSchema>({
    resolver: zodResolver(requirementsSchema),
    defaultValues: {
      minParticipationAmount: '',
      maxParticipationAmount: ''
    }
  });

  const vestingForm = useForm<TVestingSchema>({
    resolver: zodResolver(vestingSchema),
    defaultValues: {
      cliffDuration: 0,
      vestingDuration: 0
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

        <RequirementsTab
          form={requirementsForm}
          onContinueClick={onContinueClick}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <VestingTab form={vestingForm} onContinueClick={onContinueClick} />

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
