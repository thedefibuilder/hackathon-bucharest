import React, { ComponentProps } from 'react';

import { cn } from '~~/lib/utils';

type TContractsSidebar = ComponentProps<'aside'>;

export default function Sidebar({ className, children, ...otherProperties }: TContractsSidebar) {
  return (
    <aside
      className={cn('border-border flex h-fit flex-col rounded-md border p-2.5', className)}
      {...otherProperties}
    >
      {children}
    </aside>
  );
}
