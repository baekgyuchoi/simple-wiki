import {z} from 'zod'

export const SectionContentSchema = z.object({
    articleId: z.number(),
    content: z.string(),
    index: z.number(),
    sectionTitle: z.string(),
    flagged: z.boolean(),
    createdAt: z.date(),
    articleTitle: z.string(),
})

//array of messages validator
export const SectionContentArraySchema = z.array(SectionContentSchema)

export type SectionContent = z.infer<typeof SectionContentSchema>