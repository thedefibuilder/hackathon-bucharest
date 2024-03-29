import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function separateCamelCase(input: string): string {
  return input.replaceAll(/([a-z])([A-Z])/g, '$1 $2');
}
