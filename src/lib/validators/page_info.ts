import {z} from 'zod'

export const PageInfoSchema = z.object({
    page_id: z.number(),
    page_namespace: z.number(),
    page_title: z.string(),
    page_is_redirect: z.number(),
    page_content: z.string(),
    created_at: z.date(),
    thumbnail_source: z.string(),
    thumbnail_width: z.number(),
    thumbnail_height: z.number(),
    citations: z.string(),
    related_pages: z.array(z.object({
        mother_page_id: z.number(),
        page_id: z.number(),
        page_title: z.string(),
        page_description: z.string(),
    })),
    simple_meanings: z.array(z.object({
        articleId: z.number(),
        articleTitle: z.string(),
        meaning: z.string(),
        meaningHtml: z.string(),
        index: z.number(),
        sectionTitle: z.string(),
        flagged: z.boolean(),
        createdAt: z.date(),
    })).optional()
})


//array of messages validator
export const PageInfoArraySchema = z.array(PageInfoSchema)

export type PageInfo = z.infer<typeof PageInfoSchema>