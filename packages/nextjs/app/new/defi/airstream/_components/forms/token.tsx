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
import { Label } from '~~/components/ui/label';
import { airstreamTabs, preSaleTabs, TAirstreamTab, TPreSaleTab } from '~~/lib/tabs';
import { TTokenSchema } from '~~/schemas/token';
import { UseFormReturn } from 'react-hook-form';

type TTokenForm = {
  form: UseFormReturn<TTokenSchema, any, undefined>;
  onContinueClick(tab: TAirstreamTab): void;
  onCSVUpload(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function TokenForm({ form, onContinueClick, onCSVUpload }: TTokenForm) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onSubmit(values: TTokenSchema) {
    console.log(values);

    onContinueClick(airstreamTabs.review);
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

          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Label htmlFor='logo'>Airstream CSV</Label>
            <Input id='logo' type='file' accept='csv/*' onChange={onCSVUpload} />
          </div>
        </div>

        <Button type='submit'>Continue</Button>
      </form>
    </Form>
  );
}
