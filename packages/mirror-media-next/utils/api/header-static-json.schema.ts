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

const premiumSectionCategorySchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
  })
  .passthrough()

const premiumSectionSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    categories: z.array(premiumSectionCategorySchema),
  })
  .passthrough()

const topicSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
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
    headers: headersDataSchema,
  })
  .passthrough()

export const premiumSectionsStaticJsonSchema = z
  .object({
    sections: z.array(premiumSectionSchema),
  })
  .passthrough()

export const topicsStaticJsonSchema = z
  .object({
    topics: z.array(topicSchema),
  })
  .passthrough()
