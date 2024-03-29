/* eslint-disable react/prop-types */
/* eslint-disable unicorn/prevent-abbreviations */

import React from 'react';

import { cn } from '~~/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-muted animate-pulse rounded-md', className)} {...props} />;
}

export { Skeleton };
