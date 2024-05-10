import {z} from 'zod'

export const SimpleMeaningSchema = z.object({
    articleId: z.number(),
    articleTitle: z.string(),
    meaning: z.string(),
    meaningHtml: z.string(),
    index: z.number(),
    sectionTitle: z.string(),
    flagged: z.boolean(),
    createdAt: z.date(),
})

//array of messages validator
export const SimpleMeaningArraySchema = z.array(SimpleMeaningSchema)

export type SimpleMeaning = z.infer<typeof SimpleMeaningSchema>