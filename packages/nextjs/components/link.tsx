import React, { ComponentProps } from 'react';

import { cn } from '~~/lib/utils';
import Link from 'next/link';

type TCLink = ComponentProps<'a'>;

export default function CLink({ href, children, className, ...otherProperties }: TCLink) {
  return (
    <Link href={href ?? ''} className={cn('', className)} {...otherProperties}>
      {children}
    </Link>
  );
}
