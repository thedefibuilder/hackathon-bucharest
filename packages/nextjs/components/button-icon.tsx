import React from 'react';

import type { LucideIcon } from 'lucide-react';
import type { ButtonProperties } from './ui/button';

import { cn } from '~~/lib/utils';

import { Button } from './ui/button';

type TButtonIcon = ButtonProperties & {
  icon: LucideIcon;
  iconSize?: number;
  text?: string;
};

export default function ButtonIcon({
  icon: Icon,
  iconSize = 15,
  title,
  text,
  size = 'icon',
  variant = 'ghost',
  className,
  ...otherProperties
}: TButtonIcon) {
  return (
    <Button
      title={title}
      size={text ? 'default' : size}
      variant={variant}
      className={cn(
        'h-7 w-7 text-muted-foreground',
        { 'flex w-fit flex-row gap-x-2 px-2 text-sm': text },
        className
      )}
      {...otherProperties}
    >
      <Icon size={iconSize} />
      {text ? <span>{text}</span> : <span className='sr-only'>{title}</span>}
    </Button>
  );
}
