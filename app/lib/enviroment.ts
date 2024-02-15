import { z } from 'zod';

const EnviromentsSchema = z.object({
  OMIE_API_SECRET: z.string(),
  OMIE_API_KEY: z.string(),
  OMIE_URL: z.string(),
});

export const env = EnviromentsSchema.parse({
  OMIE_API_SECRET: process.env.NEXT_PUBLIC_OMIE_API_SECRET,
  OMIE_API_KEY: process.env.NEXT_PUBLIC_OMIE_API_KEY,
  OMIE_URL: process.env.NEXT_PUBLIC_OMIE_URL
});