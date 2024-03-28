import React, { ComponentProps } from 'react';

import { cn } from '~~/utils/utils';

type TContractsSidebar = ComponentProps<'aside'>;

export default function Sidebar({ className, children, ...otherProperties }: TContractsSidebar) {
  return (
    <aside
      className={cn('flex flex-col rounded-md border-2 border-lime-400 p-2.5', className)}
      {...otherProperties}
    >
      {children}
    </aside>
  );
}
