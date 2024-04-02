import {z} from 'zod'

export const RelatedPageSchema = z.object({
    mother_page_id: z.number(),
    page_id: z.number(),
    page_title: z.string(),
    page_description: z.string(),
})

//array of messages validator
export const RelatedPageArraySchema = z.array(RelatedPageSchema)

export type RelatedPage = z.infer<typeof RelatedPageSchema>