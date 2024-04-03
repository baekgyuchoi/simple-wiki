import {z} from 'zod'

export const SimpleMeaningSchema = z.object({
    id: z.number(),
    articleId: z.number(),
    meaning: z.string(),
    index: z.number(),
    sectionTitle: z.string(),
    flagged: z.boolean(),
    createdAt: z.date(),
})

//array of messages validator
export const SimpleMeaningArraySchema = z.array(SimpleMeaningSchema)

export type SimpleMeaning = z.infer<typeof SimpleMeaningSchema>