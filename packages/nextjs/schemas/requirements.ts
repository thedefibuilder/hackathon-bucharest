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

  dateRange: z
    .object({
      from: z.date(),
      to: z.date()
    })
    .optional()
});

export type TRequirementsSchema = z.infer<typeof requirementsSchema>;
