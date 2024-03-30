import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '~~/components/ui/button';
import { Checkbox } from '~~/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~~/components/ui/form';
import { Input } from '~~/components/ui/input';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';
import { TTokenomicsSchema } from '~~/schemas/tokenomics';
import { UseFormReturn } from 'react-hook-form';

type TTokenomicsForm = {
  form: UseFormReturn<TTokenomicsSchema, any, undefined>;
  onContinueClick(tab: TERC20Tab): void;
};

export default function TokenomicsForm({ form, onContinueClick }: TTokenomicsForm) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onSubmit(values: TTokenomicsSchema) {
    console.log(values);

    onContinueClick(erc20Tabs.socials);
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
            name='tokenName'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Token name</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input
                    placeholder='e.g. DeFi Builder'
                    className='placeholder:italic'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tokenSymbol'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Token symbol</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input placeholder='e.g. DFB' className='placeholder:italic' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='maxSupply'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Max Supply</FormLabel>
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
            name='premintAmount'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Pre-mint Amount</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Input placeholder='e.g. 100.000' className='placeholder:italic' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isBurnable'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Burnable</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type='submit'>Continue</Button>
      </form>
    </Form>
  );
}
