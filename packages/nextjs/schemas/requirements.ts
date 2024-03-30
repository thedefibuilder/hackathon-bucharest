import { z } from 'zod';

export const requirementsSchema = z.object({
  minParticipationAmount: z
    .string({ required_error: 'is required' })
    .trim()
    .refine((value) => !Number.isNaN(Number(value)), { message: 'must be a number' })
    .refine((value) => Number(value) > 0, { message: 'must be positive' }),

  maxParticipationAmount: z
    .string({ required_error: 'is required' })
    .trim()
    .refine((value) => !Number.isNaN(Number(value)), { message: 'must be a number' })
    .refine((value) => Number(value) > 0, { message: 'must be positive' }),
  startTime: z.date({ required_error: 'is required' }),
  endTime: z.date({ required_error: 'is required' }).refine((value) => value > new Date(), {
    message: 'must be in the future'
  })
});

export type TRequirementsSchema = z.infer<typeof requirementsSchema>;
