import { z } from 'zod';

const SecretSchema = z.object({
  key: z.string(),
  secret: z.string()
})

const EnviromentsSchema = z.object({
  OMIE_SECRETS: z.object({
    BWS: SecretSchema,
    ICB: SecretSchema,
    WFC: SecretSchema,
    MGC: SecretSchema,
    ICBFILIAL: SecretSchema,
  }),
  OMIE_URL: z.string()
});

export const env = EnviromentsSchema.parse({
  OMIE_SECRETS: {
    MGC: {
      key: process.env.OMIE_MGC_API_KEY,
      secret: process.env.OMIE_MGC_API_SECRET
    },
    WFC: {
      key: process.env.OMIE_WFC_API_KEY,
      secret: process.env.OMIE_WFC_API_SECRET
    },
    BWS: {
      key: process.env.OMIE_BWS_API_KEY,
      secret: process.env.OMIE_BWS_API_SECRET
    },
    ICB: {
      key: process.env.OMIE_ICB_API_KEY,
      secret: process.env.OMIE_ICB_API_SECRET
    },
    ICBFILIAL: {
      key: process.env.OMIE_ICBFILIAL_API_KEY,
      secret: process.env.OMIE_ICBFILIAL_API_SECRET
    },
  },
  OMIE_URL: process.env.NEXT_PUBLIC_OMIE_URL
});