/* eslint-disable unicorn/no-nested-ternary */
'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~~/components/ui/select';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { TOfferingSchema } from '~~/schemas/offering';
import { UseFormReturn } from 'react-hook-form';

type TOfferingForm = {
  form: UseFormReturn<TOfferingSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
};

const arbitrumUsdcAddress = '0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d';

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
                <FormLabel>Payment Token</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='USDC' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={arbitrumUsdcAddress}>USDC</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
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
