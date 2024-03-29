import React from 'react';

import { Button } from '~~/components/ui/button';
import { DatePickerWithRange } from '~~/components/ui/date-range-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~~/components/ui/form';
import { Input } from '~~/components/ui/input';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { TRequirementsSchema } from '~~/schemas/requirements';
import { DateRange } from 'react-day-picker';
import { UseFormReturn } from 'react-hook-form';

type TRequirementsForm = {
  form: UseFormReturn<TRequirementsSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export default function RequirementsForm({
  form,
  onContinueClick,
  dateRange,
  setDateRange
}: TRequirementsForm) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onSubmit(values: TRequirementsSchema) {
    console.log(values);
    if (dateRange) form.setValue('dateRange', { from: dateRange.from!, to: dateRange.to! });
    onContinueClick(preSaleTabs.vesting);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full max-w-xl flex-col items-end space-y-5'
      >
        <div className='flex w-full flex-col space-y-8'>
          <FormField
            control={form.control}
            name='minParticipationAmount'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Min Participation Amount</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input placeholder='100' className='resize-none placeholder:italic' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='maxParticipationAmount'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Max Participation Amount</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input
                    placeholder='100 000 000'
                    className='resize-none placeholder:italic'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dateRange'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Pre-Sale Period</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <DatePickerWithRange
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />{' '}
        </div>

        <Button type='submit'>Continue</Button>
      </form>
    </Form>
  );
}
