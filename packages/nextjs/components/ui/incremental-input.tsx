import React from 'react';

import { Button } from '~~/components/ui/button';
import { InputProps } from '~~/components/ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { Input } from './input';

interface IIncrementalInput extends InputProps {
  type: 'hours' | 'days';
  onUpClick: () => void;
  onDownClick: () => void;
}

export function IncrementalInput({
  type,
  onUpClick,
  onDownClick,
  ...properties
}: IIncrementalInput) {
  return (
    <div className='relative flex w-full items-center'>
      <div className='absolute left-3 flex h-full w-full flex-col justify-between py-2'>
        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='h-3 w-6 rounded-sm'
          onClick={onUpClick}
        >
          <ChevronUp className='text-secondary-foreground h-3.5 w-3.5' />
        </Button>

        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='h-3 w-6 rounded-sm'
          onClick={onDownClick}
        >
          <ChevronDown className='text-secondary-foreground h-3.5 w-3.5' />
        </Button>
      </div>

      <span className='text-muted-foreground absolute right-3 text-sm'>{type}</span>

      <Input className='h-12 w-full pl-12 text-lg' {...properties} />
    </div>
  );
}
