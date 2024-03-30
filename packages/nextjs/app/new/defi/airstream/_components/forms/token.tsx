import React, { useState } from 'react';

import { Button } from '~~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~~/components/ui/form';
import { IncrementalInput } from '~~/components/ui/incremental-input';
import { Input } from '~~/components/ui/input';
import { Label } from '~~/components/ui/label';
import { airstreamTabs, preSaleTabs, TAirstreamTab, TPreSaleTab } from '~~/lib/tabs';
import { TTokenSchema } from '~~/schemas/token';
import { addDays, addHours, format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type TTokenForm = {
  form: UseFormReturn<TTokenSchema, any, undefined>;
  onContinueClick(tab: TAirstreamTab): void;
  onCSVUpload(event: React.ChangeEvent<HTMLInputElement>): void;
};

function addDurations(startTime: Date, days: string, hours: string): number {
  return (
    (addHours(addDays(startTime, Number(days)), Number(hours)).getTime() - startTime.getTime()) /
    1000
  );
}

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

export default function TokenForm({ form, onContinueClick, onCSVUpload }: TTokenForm) {
  const [cliffDurationInDays, setCliffDurationInDays] = useState('');
  const [cliffDurationInHours, setCliffDurationInHours] = useState('');
  const startDate = new Date();
  const cliffEndDatePrevision = addHours(
    addDays(startDate, Number(cliffDurationInDays)),
    Number(cliffDurationInHours)
  );

  const [vestingDurationInDays, setVestingDurationInDays] = useState('');
  const [vestingDurationInHours, setVestingDurationInHours] = useState('');
  const vestingEndDatePrevision = addHours(
    addDays(startDate, Number(vestingDurationInDays)),
    Number(vestingDurationInHours)
  );

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
                        onClick={() => {
                          setCliffDurationInDays(duration.value);
                          form.setValue(
                            'cliffDuration',
                            addDurations(startDate, duration.value, cliffDurationInHours)
                          );
                        }}
                      >
                        {duration.text}
                      </Button>
                    ))}
                  </div>

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
                          form.setValue('cliffDuration', 0);
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
                          setCliffDurationInDays((previousState) => {
                            const newDays = (
                              (Number(previousState) + 1 + daysInAYear) %
                              daysInAYear
                            ).toString();
                            form.setValue(
                              'cliffDuration',
                              addDurations(startDate, newDays, cliffDurationInHours)
                            );
                            return newDays;
                          })
                        }
                        onDownClick={() =>
                          setCliffDurationInDays((previousState) => {
                            const newDays = (
                              (Number(previousState) - 1 + daysInAYear) %
                              daysInAYear
                            ).toString();
                            form.setValue(
                              'cliffDuration',
                              addDurations(startDate, newDays, cliffDurationInHours)
                            );
                            return newDays;
                          })
                        }
                      />

                      <IncrementalInput
                        id='duration-hours'
                        type='hours'
                        value={cliffDurationInHours}
                        placeholder='0'
                        readOnly
                        onUpClick={() =>
                          setCliffDurationInHours((previousState) => {
                            const newHours = (
                              (Number(previousState) + 1 + hoursInADay) %
                              hoursInADay
                            ).toString();
                            form.setValue(
                              'cliffDuration',
                              addDurations(startDate, cliffDurationInDays, newHours)
                            );
                            return newHours;
                          })
                        }
                        onDownClick={() =>
                          setCliffDurationInHours((previousState) => {
                            const newHours = (
                              (Number(previousState) - 1 + hoursInADay) %
                              hoursInADay
                            ).toString();
                            form.setValue(
                              'cliffDuration',
                              addDurations(startDate, cliffDurationInDays, newHours)
                            );
                            return newHours;
                          })
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
                        onClick={() => {
                          setVestingDurationInDays(duration.value);
                          form.setValue(
                            'vestingDuration',
                            addDurations(startDate, duration.value, vestingDurationInHours)
                          );
                        }}
                      >
                        {duration.text}
                      </Button>
                    ))}
                  </div>

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
                          form.setValue('vestingDuration', 0);
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
                          setVestingDurationInDays((previousState) => {
                            const newDays = (
                              (Number(previousState) + 1 + daysInAYear) %
                              daysInAYear
                            ).toString();
                            form.setValue(
                              'vestingDuration',
                              addDurations(startDate, newDays, vestingDurationInHours)
                            );
                            return newDays;
                          })
                        }
                        onDownClick={() =>
                          setVestingDurationInDays((previousState) => {
                            const newDays = (
                              (Number(previousState) - 1 + daysInAYear) %
                              daysInAYear
                            ).toString();
                            form.setValue(
                              'vestingDuration',
                              addDurations(startDate, newDays, vestingDurationInHours)
                            );
                            return newDays;
                          })
                        }
                      />

                      <IncrementalInput
                        id='duration-hours'
                        type='hours'
                        value={vestingDurationInHours}
                        placeholder='0'
                        readOnly
                        onUpClick={() =>
                          setVestingDurationInHours((previousState) => {
                            const newHours = (
                              (Number(previousState) + 1 + hoursInADay) %
                              hoursInADay
                            ).toString();
                            form.setValue(
                              'vestingDuration',
                              addDurations(startDate, vestingDurationInDays, newHours)
                            );
                            return newHours;
                          })
                        }
                        onDownClick={() =>
                          setVestingDurationInHours((previousState) => {
                            const newHours = (
                              (Number(previousState) - 1 + hoursInADay) %
                              hoursInADay
                            ).toString();
                            form.setValue(
                              'vestingDuration',
                              addDurations(startDate, vestingDurationInDays, newHours)
                            );
                            return newHours;
                          })
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
