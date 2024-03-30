import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { TVestingSchema } from '~~/schemas/vesting';
import { UseFormReturn } from 'react-hook-form';

import VestingForm from '../forms/vesting';

type TVestingTab = {
  form: UseFormReturn<TVestingSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
};

export default function VestingTab({ form, onContinueClick }: TVestingTab) {
  return (
    <TabsContent
      value={preSaleTabs.vesting}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <VestingForm form={form} onContinueClick={onContinueClick} />
      </div>
    </TabsContent>
  );
}
