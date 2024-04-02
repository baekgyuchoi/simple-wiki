import {z} from 'zod'

export const MagaMeaningSchema = z.object({
    id: z.number(),
    articleId: z.number(),
    meaning: z.string(),
    index: z.number(),
    sectionTitle: z.string(),
    flagged: z.boolean(),
    createdAt: z.date(),
})

//array of messages validator
export const MagaMeaningArraySchema = z.array(MagaMeaningSchema)

export type MagaMeaning = z.infer<typeof MagaMeaningSchema>