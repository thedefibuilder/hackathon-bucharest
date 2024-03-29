import React from 'react';

import type { ButtonProperties } from './ui/button';

import { cn } from '~~/lib/utils';
import { Loader2 } from 'lucide-react';

import { Button } from './ui/button';

type TButtonSpinner = ButtonProperties & {
  isLoading: boolean;
  defaultContent: string;
  loadingContent: string;
};

export default function ButtonSpinner({
  isLoading,
  defaultContent,
  loadingContent,
  className,
  ...otherProperties
}: TButtonSpinner) {
  return (
    <Button disabled={isLoading} className={cn(className)} {...otherProperties}>
      {isLoading ? (
        <div className='flex items-center gap-x-2.5'>
          <Loader2 className='h-5 w-5 animate-spin' />
          <span>{loadingContent}</span>
        </div>
      ) : (
        <span>{defaultContent}</span>
      )}
    </Button>
  );
}
