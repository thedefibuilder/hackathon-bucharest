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
import { Textarea } from '~~/components/ui/textarea';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';
import { TIdentitySchema } from '~~/schemas/identity';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';

type TIdentityForm = {
  form: UseFormReturn<TIdentitySchema, any, undefined>;
  onContinueClick(tab: TERC20Tab): void;
  onLogoUpload(event: React.ChangeEvent<HTMLInputElement>): void;
  onCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>): void;
};

export default function IdentityForm({
  form,
  onContinueClick,
  onLogoUpload,
  onCoverImageUpload
}: TIdentityForm) {
  const logoBase64 = form.watch('logoBase64');
  const coverImageBase64 = form.watch('coverImageBase64');

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onSubmit(values: TIdentitySchema) {
    console.log(values);

    onContinueClick(erc20Tabs.tokenomics);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full max-w-xl flex-col items-end space-y-5'
      >
        <div className='flex w-full gap-x-5'>
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            {logoBase64 && (
              <Image
                src={logoBase64 ?? ''}
                alt='Token Logo'
                width={200}
                height={113}
                className='aspect-auto w-full rounded-md'
              />
            )}

            <Label htmlFor='logo'>Token Logo</Label>
            <Input id='logo' type='file' accept='image/*' onChange={onLogoUpload} />
          </div>

          <div className='grid w-full max-w-sm items-center gap-1.5'>
            {coverImageBase64 && (
              <Image
                src={coverImageBase64 ?? ''}
                alt='Cover Image'
                width={200}
                height={113}
                className='aspect-auto w-full rounded-md'
              />
            )}

            <Label htmlFor='cover'>Token Cover Image</Label>
            <Input id='cover' type='file' accept='image/*' onChange={onCoverImageUpload} />
          </div>
        </div>

        <div className='flex w-full flex-col space-y-8'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Description</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder='e.g. DeFi Builder is a token...'
                    className='resize-none placeholder:italic'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='roadmap'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Roadmap</FormLabel>
                  <FormMessage className='leading-none' />
                </div>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder='e.g. DeFi Builder is planning to...'
                    className='resize-none placeholder:italic'
                    {...field}
                  />
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
