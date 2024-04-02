import {z} from 'zod'

export const ArticleSchema = z.object({
    page_id: z.number(),
    page_namespace: z.number(),
    page_title: z.string().transform((data) => Buffer.from(data)),
    page_is_redirect: z.number(),
    page_is_new: z.number(),
    page_random: z.number(),
    page_touched: z.string().transform((data) => Buffer.from(data)),
    page_links_updated: z.string().optional().transform((data) => data ? Buffer.from(data) : null),
    page_latest: z.number(),
    page_len: z.number(),
    page_content_model: z.string().optional().transform((data) => data ? Buffer.from(data) : null),
    page_lang: z.string().optional().transform((data) => data ? Buffer.from(data) : null),
})

//array of messages validator
export const ArticleInfoArraySchema = z.array(ArticleSchema)

export type ArticleInfo = z.infer<typeof ArticleSchema>