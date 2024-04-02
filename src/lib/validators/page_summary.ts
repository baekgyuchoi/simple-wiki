
import {z} from 'zod'

export const PageSummarySchema = z.object({
    type: z.string(),
    title: z.string(),
    displaytitle: z.string(),
    namespace: z.object({
        id: z.number(),
        text: z.string()
    }),
    wikibase_item: z.string(),
    titles: z.object({
        canonical: z.string(),
        normalized: z.string(),
        display: z.string()
    }),
    pageid: z.number(),
    thumbnail: z.object({
        source: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional()
    }).optional(),
    originalimage: z.object({
        source: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional()
    }).optional(),
    lang: z.string(),
    dir: z.string(),
    revision: z.string(),
    tid: z.string(),
    timestamp: z.string(),
    description: z.string().optional(),
    description_source: z.string().optional(),
    content_urls: z.object({
        desktop: z.object({
            page: z.string(),
            revisions: z.string(),
            edit: z.string(),
            talk: z.string()
        }),
        mobile: z.object({
            page: z.string(),
            revisions: z.string(),
            edit: z.string(),
            talk: z.string()
        })
    }),
    extract: z.string(),
    extract_html: z.string(),

})

//array of messages validator
export const ArticleInfoArraySchema = z.array(PageSummarySchema)

export type PageSummary = z.infer<typeof PageSummarySchema>