import { z } from 'zod';

export const identitySchema = z.object({
  logoBase64: z.string().nullable(),
  coverImageBase64: z.string().nullable(),
  description: z
    .string({ required_error: 'is required' })
    .trim()
    .min(2, { message: 'must contain at least 2 characters' }),
  roadmap: z
    .string({ required_error: 'is required' })
    .trim()
    .min(2, { message: 'must contain at least 2 characters' })
});

export type TIdentitySchema = z.infer<typeof identitySchema>;
