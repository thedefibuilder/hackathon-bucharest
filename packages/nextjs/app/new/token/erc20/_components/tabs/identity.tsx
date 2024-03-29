import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TTab } from '~~/lib/tabs';
import { TIdentitySchema } from '~~/schemas/identity';
import { UseFormReturn } from 'react-hook-form';

import IdentityForm from '../forms/identity';

type TIdentityTab = {
  form: UseFormReturn<TIdentitySchema, any, undefined>;
  onContinueClick(tab: TTab): void;
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
      className='h-full overflow-hidden rounded-md border border-border'
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
