import { z } from 'zod';

export const tokenomicsSchema = z.object({
  tokenName: z
    .string({ required_error: 'is required' })
    .trim()
    .min(2, { message: 'must contain at least 2 characters' })
    .max(50, { message: 'must contain at most 50 characters' }),
  tokenSymbol: z
    .string({ required_error: 'is required' })
    .trim()
    .min(1, { message: 'must contain at least 1 character' })
    .max(10, { message: 'must contain at most 10 characters' })
    .refine((value) => value === value.toUpperCase(), {
      message: 'must contain only uppercase characters'
    }),
  maxSupply: z
    .string({ required_error: 'is required' })
    .trim()
    .refine((value) => !Number.isNaN(Number(value)), { message: 'must be a number' })
    .refine((value) => Number(value) >= 1, { message: 'must be grater than 0' }),
  premintAmount: z
    .string({ required_error: 'is required' })
    .trim()
    .refine((value) => !Number.isNaN(Number(value)), { message: 'must be a number' })
    .refine((value) => Number(value) >= 0, { message: 'must be grater than 0' })
    .default('0'),
 isBurnable: z.boolean()
});

export type TTokenomicsSchema = z.infer<typeof tokenomicsSchema>;
