/* eslint-disable quotes */
'use client';

import React, { useState } from 'react';

import { Separator } from '@radix-ui/react-separator';
import { Button } from '~~/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '~~/components/ui/form';
import { IncrementalInput } from '~~/components/ui/incremental-input';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { TVestingSchema } from '~~/schemas/vesting';
import { addDays, addHours, format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type TVestingForm = {
  form: UseFormReturn<TVestingSchema, any, undefined>;
  onContinueClick(tab: TPreSaleTab): void;
};

const hoursInADay = 24;
const daysInAYear = 365;
const suggestedDurations = [
  { value: '360', text: '360 days' },
  { value: '180', text: '180 days' },
  { value: '30', text: '30 days' },
  { value: '7', text: '7 days' },
  { value: '2', text: '2 days' },
  { value: '1', text: '1 day' }
];

export default function VestingForm({ form, onContinueClick }: TVestingForm) {
  const [cliffDurationInDays, setCliffDurationInDays] = useState('');
  const [cliffDurationInHours, setCliffDurationInHours] = useState('');
  const startDate = new Date();
  const cliffEndDatePrevision = addHours(
    addDays(startDate, Number(cliffDurationInDays)),
    Number(cliffDurationInHours)
  );
  const cliffDurationInSeconds = (cliffEndDatePrevision.getTime() - startDate.getTime()) / 1000;

  const [vestingDurationInDays, setVestingDurationInDays] = useState('');
  const [vestingDurationInHours, setVestingDurationInHours] = useState('');
  const vestingEndDatePrevision = addHours(
    addDays(startDate, Number(vestingDurationInDays)),
    Number(vestingDurationInHours)
  );
  const vestingDurationInSeconds = (vestingEndDatePrevision.getTime() - startDate.getTime()) / 1000;

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onSubmit(values: TVestingSchema) {
    console.log(values);
    form.setValue('cliffDuration', cliffDurationInSeconds);
    form.setValue('vestingDuration', vestingDurationInSeconds);

    onContinueClick(preSaleTabs.review);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full max-w-xl flex-col items-end space-y-5'
      >
        <h4 className='text-xl font-semibold'>
          Vesting schedule for your users, which starts after the pre-sale.
        </h4>

        <div className='flex w-full flex-col space-y-8'>
          <FormField
            control={form.control}
            name='cliffDuration'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Cliff Duration</FormLabel>
                  <FormMessage className='leading-none' />
                </div>

                <div className='flex flex-col gap-y-2.5'>
                  <span className='text-sm'>Suggested</span>

                  <div className='flex gap-x-1.5'>
                    {suggestedDurations.map((duration, index) => (
                      <Button
                        type='button'
                        key={`${duration.value}-${index}`}
                        variant={cliffDurationInDays === duration.value ? 'secondary' : 'outline'}
                        className='px-2 py-1 text-xs'
                        onClick={() => setCliffDurationInDays(duration.value)}
                      >
                        {duration.text}
                      </Button>
                    ))}
                  </div>

                  <Separator className='my-1' />

                  <div className='flex flex-col gap-y-2.5'>
                    <div className='flex w-full items-center justify-between'>
                      <span className='text-sm'>Custom</span>

                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        className='h-6 w-6'
                        onClick={() => {
                          setCliffDurationInDays('');
                          setCliffDurationInHours('');
                        }}
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </div>

                    <div className='relative flex gap-x-2.5'>
                      <IncrementalInput
                        id='duration-days'
                        type='days'
                        value={cliffDurationInDays}
                        placeholder='0'
                        readOnly
                        onUpClick={() =>
                          setCliffDurationInDays((previousState) =>
                            ((Number(previousState) + 1 + daysInAYear) % daysInAYear).toString()
                          )
                        }
                        onDownClick={() =>
                          setCliffDurationInDays((previousState) =>
                            ((Number(previousState) - 1 + daysInAYear) % daysInAYear).toString()
                          )
                        }
                      />

                      <IncrementalInput
                        id='duration-hours'
                        type='hours'
                        value={cliffDurationInHours}
                        placeholder='0'
                        readOnly
                        onUpClick={() =>
                          setCliffDurationInHours((previousState) =>
                            ((Number(previousState) + 1 + hoursInADay) % hoursInADay).toString()
                          )
                        }
                        onDownClick={() =>
                          setCliffDurationInHours((previousState) =>
                            ((Number(previousState) - 1 + hoursInADay) % hoursInADay).toString()
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <span className='text-muted-foreground text-sm'>
                  The cliff would end on {format(cliffEndDatePrevision, "MMM d ''yy ~ h:mm a")}
                </span>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='vestingDuration'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-x-1'>
                  <FormLabel>Vesting Duration</FormLabel>
                  <FormMessage className='leading-none' />
                </div>

                <div className='flex flex-col gap-y-2.5'>
                  <span className='text-sm'>Suggested</span>

                  <div className='flex gap-x-1.5'>
                    {suggestedDurations.map((duration, index) => (
                      <Button
                        type='button'
                        key={`${duration.value}-${index}`}
                        variant={vestingDurationInDays === duration.value ? 'secondary' : 'outline'}
                        className='px-2 py-1 text-xs'
                        onClick={() => setVestingDurationInDays(duration.value)}
                      >
                        {duration.text}
                      </Button>
                    ))}
                  </div>

                  <Separator className='my-1' />

                  <div className='flex flex-col gap-y-2.5'>
                    <div className='flex w-full items-center justify-between'>
                      <span className='text-sm'>Custom</span>

                      <Button
                        type='button'
                        size='icon'
                        variant='outline'
                        className='h-6 w-6'
                        onClick={() => {
                          setVestingDurationInDays('');
                          setVestingDurationInHours('');
                        }}
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </div>

                    <div className='relative flex gap-x-2.5'>
                      <IncrementalInput
                        id='duration-days'
                        type='days'
                        value={vestingDurationInDays}
                        placeholder='0'
                        readOnly
                        onUpClick={() =>
                          setVestingDurationInDays((previousState) =>
                            ((Number(previousState) + 1 + daysInAYear) % daysInAYear).toString()
                          )
                        }
                        onDownClick={() =>
                          setVestingDurationInDays((previousState) =>
                            ((Number(previousState) - 1 + daysInAYear) % daysInAYear).toString()
                          )
                        }
                      />

                      <IncrementalInput
                        id='duration-hours'
                        type='hours'
                        value={vestingDurationInHours}
                        placeholder='0'
                        readOnly
                        onUpClick={() =>
                          setVestingDurationInHours((previousState) =>
                            ((Number(previousState) + 1 + hoursInADay) % hoursInADay).toString()
                          )
                        }
                        onDownClick={() =>
                          setVestingDurationInHours((previousState) =>
                            ((Number(previousState) - 1 + hoursInADay) % hoursInADay).toString()
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <span className='text-muted-foreground text-sm'>
                  The vesting would end on {format(vestingEndDatePrevision, "MMM d ''yy ~ h:mm a")}
                </span>
              </FormItem>
            )}
          />
        </div>

        <Button type='submit'>Continue</Button>
      </form>
    </Form>
  );
}
