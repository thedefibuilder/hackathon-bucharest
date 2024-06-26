import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';
import { TTokenomicsSchema } from '~~/schemas/tokenomics';
import { UseFormReturn } from 'react-hook-form';

import TokenomicsForm from '../forms/tokenomics';

type TTokenomicsTab = {
  form: UseFormReturn<TTokenomicsSchema, any, undefined>;
  onContinueClick(tab: TERC20Tab): void;
};

export default function TokenomicsTab({ form, onContinueClick }: TTokenomicsTab) {
  return (
    <TabsContent
      value={erc20Tabs.tokenomics}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <TokenomicsForm form={form} onContinueClick={onContinueClick} />
      </div>
    </TabsContent>
  );
}
