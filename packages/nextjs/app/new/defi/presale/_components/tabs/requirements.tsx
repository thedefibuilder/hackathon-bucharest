import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { TRequirementsSchema } from '~~/schemas/requirements';
import { DateRange } from 'react-day-picker';
import { UseFormReturn } from 'react-hook-form';

import RequirementsForm from '../forms/requirements';

type TRequirementsTab = {
  form: UseFormReturn<TRequirementsSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export default function RequirementsTab({
  form,
  onContinueClick,
  dateRange,
  setDateRange
}: TRequirementsTab) {
  return (
    <TabsContent
      value={preSaleTabs.requirements}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>
        <RequirementsForm
          form={form}
          onContinueClick={onContinueClick}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      </div>
    </TabsContent>
  );
}
