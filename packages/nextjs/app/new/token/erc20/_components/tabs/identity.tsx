import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';
import { TIdentitySchema } from '~~/schemas/identity';
import { UseFormReturn } from 'react-hook-form';

import IdentityForm from '../forms/identity';

type TIdentityTab = {
  form: UseFormReturn<TIdentitySchema, any, undefined>;
  onContinueClick(tab: TERC20Tab): void;
  onLogoUpload(event: React.ChangeEvent<HTMLInputElement>): void;
  onCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function IdentityTab({
  form,
  onContinueClick,
  onLogoUpload,
  onCoverImageUpload
}: TIdentityTab) {
  return (
    <TabsContent
      value={erc20Tabs.identity}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <IdentityForm
          form={form}
          onContinueClick={onContinueClick}
          onLogoUpload={onLogoUpload}
          onCoverImageUpload={onCoverImageUpload}
        />
      </div>
    </TabsContent>
  );
}
