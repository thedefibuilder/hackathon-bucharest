import React from 'react';

import { Button } from '~~/components/ui/button';
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
import { TOfferingSchema } from '~~/schemas/offering';
import { UseFormReturn } from 'react-hook-form';

type TOfferingForm = {
  form: UseFormReturn<TOfferingSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
};

export default function OfferingForm({ form, onContinueClick }: TOfferingForm) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onSubmit(values: TOfferingSchema) {
    console.log(values);

    onContinueClick(preSaleTabs.requirements);
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
            name='token'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Offering Token</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input
                    placeholder='e.g. 0x3922745E89F607703957549acD09CE1A578d8d74'
                    className='resize-none placeholder:italic'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='payment'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Payment Token</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input
                    placeholder='e.g. 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
                    className='resize-none placeholder:italic'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='allocationSupply'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Presale Supply</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input placeholder='e.g. 1.000.000' className='placeholder:italic' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Price Offering</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input placeholder='e.g. 0.1' className='placeholder:italic' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button type='submit'>Continue</Button>
      </form>
    </Form>
  );
}
