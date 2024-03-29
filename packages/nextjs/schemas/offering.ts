/* eslint-disable sonarjs/no-duplicate-string */
import { z } from 'zod';

export const offeringSchema = z.object({
  token: z
    .string({ required_error: 'is required' })
    .trim()
    .length(42, { message: 'must be valid address' }),
  payment: z
    .string({ required_error: 'is required' })
    .trim()
    .length(42, { message: 'must be valid address' }),
  allocationSupply: z
    .string({ required_error: 'is required' })
    .trim()
    .refine((value) => !Number.isNaN(Number(value)), { message: 'must be a number' })
    .refine((value) => Number(value) >= 1, { message: 'must be grater than 0' }),
  price: z
    .string({ required_error: 'is required' })
    .trim()
    .refine((value) => !Number.isNaN(Number(value)), { message: 'must be a number' })
    .refine((value) => Number(value) > 0, { message: 'must be grater than 0' })
});

export type TOfferingSchema = z.infer<typeof offeringSchema>;
