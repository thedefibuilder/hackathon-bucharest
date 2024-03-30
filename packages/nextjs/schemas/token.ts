import { isAddress } from 'viem';
import { z } from 'zod';

export const tokenSchema = z.object({
  token: z.string().refine((value) => isAddress(value), {
    message: 'Valid token address is required'
  }),
  recipients: z.string(),
  root: z.string(),
  total: z.string(),
  CID: z.string(),
  vestingDuration: z.number(),
  cliffDuration: z.number()
});

export type TTokenSchema = z.infer<typeof tokenSchema>;
