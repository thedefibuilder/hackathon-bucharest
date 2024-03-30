import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { TOfferingSchema } from '~~/schemas/offering';
import { UseFormReturn } from 'react-hook-form';

import OfferingForm from '../forms/offering';

type TOfferingTab = {
  form: UseFormReturn<TOfferingSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
};

export default function OfferingTab({ form, onContinueClick }: TOfferingTab) {
  return (
    <TabsContent
      value={preSaleTabs.offering}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <OfferingForm form={form} onContinueClick={onContinueClick} />
      </div>
    </TabsContent>
  );
}
