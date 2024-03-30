import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';
import { TSocialsSchema } from '~~/schemas/socials';
import { UseFormReturn } from 'react-hook-form';

import SocialsForm from '../forms/socials';

type TSocialsTab = {
  form: UseFormReturn<TSocialsSchema, any, undefined>;
  onContinueClick(tab: TERC20Tab): void;
};

export default function SocialsTab({ form, onContinueClick }: TSocialsTab) {
  return (
    <TabsContent
      value={erc20Tabs.socials}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <SocialsForm form={form} onContinueClick={onContinueClick} />
      </div>
    </TabsContent>
  );
}
