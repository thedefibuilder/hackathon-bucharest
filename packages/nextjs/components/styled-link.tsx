import React from 'react';

import type { UrlObject } from 'node:url';
import type { HTMLAttributeAnchorTarget } from 'react';
import type { ButtonProperties } from './ui/button';

import { cn } from '~~/lib/utils';
import Link from 'next/link';

import { Button } from './ui/button';

type TStyledLink = ButtonProperties & {
  href: string | UrlObject;
  target?: HTMLAttributeAnchorTarget;
};

export default function StyledLink({
  href,
  target,
  variant,
  children,
  className,
  disabled,
  ...otherButtonProperties
}: TStyledLink) {
  return (
    <Button
      variant={variant}
      className={cn({ 'text-foreground h-fit px-0 py-0': variant === 'link' }, className)}
      disabled
      asChild
      {...otherButtonProperties}
    >
      <Link href={href} target={target} className={cn({ 'pointer-events-none': disabled })}>
        {children}
      </Link>
    </Button>
  );
}
