import { z } from 'zod';

export const socialsSchema = z.object({
  website: z.string().optional(),
  twitter: z.string().optional(),
  telegram: z.string().optional(),
  discord: z.string().optional()
});

export type TSocialsSchema = z.infer<typeof socialsSchema>;
