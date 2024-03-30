import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { airstreamTabs, TAirstreamTab } from '~~/lib/tabs';
import { TTokenSchema } from '~~/schemas/token';
import { UseFormReturn } from 'react-hook-form';

import TokenForm from '../forms/token';

type TTokenTab = {
  form: UseFormReturn<TTokenSchema, any, undefined>;
  onContinueClick(tab: TAirstreamTab): void;
  onCSVUpload(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function TokenTab({ form, onContinueClick, onCSVUpload }: TTokenTab) {
  return (
    <TabsContent
      value={airstreamTabs.token}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <TokenForm form={form} onContinueClick={onContinueClick} onCSVUpload={onCSVUpload} />
      </div>
    </TabsContent>
  );
}
