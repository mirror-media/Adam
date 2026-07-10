import { z } from 'zod'

const categoryInHeadersDataSectionSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    isMemberOnly: z.boolean(),
  })
  .passthrough()

const headersDataSectionSchema = z
  .object({
    order: z.number(),
    type: z.literal('section'),
    slug: z.string(),
    name: z.string(),
    categories: z.array(categoryInHeadersDataSectionSchema),
  })
  .passthrough()

const headersDataCategorySchema = z
  .object({
    order: z.number(),
    type: z.literal('category'),
    slug: z.string(),
    name: z.string(),
    isMemberOnly: z.boolean(),
    sections: z.array(z.string()),
  })
  .passthrough()

const headersDataSchema = z.array(
  z.discriminatedUnion('type', [
    headersDataSectionSchema,
    headersDataCategorySchema,
  ])
)

export const headersStaticJsonSchema = z
  .object({
    headers: headersDataSchema.optional(),
  })
  .passthrough()

export const premiumSectionsStaticJsonSchema = z
  .object({
    sections: headersDataSchema.optional(),
  })
  .passthrough()

export const topicsStaticJsonSchema = z
  .object({
    topics: z.array(z.record(z.unknown())).optional(),
  })
  .passthrough()
