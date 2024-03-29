import { z } from 'zod';

export const vestingSchema = z.object({
  cliffDuration: z.number({ required_error: 'is required' }).int().positive(),
  vestingDuration: z.number({ required_error: 'is required' }).int().positive()
});

export type TVestingSchema = z.infer<typeof vestingSchema>;
