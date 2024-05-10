import prisma from '@/lib/db';


const root_URL = "https://www.thesimplewiki.com";

async function fetchProducts(pageNumber: number) {
    const simple_pages = await prisma.pages.findMany({
        take: 10000,
        skip: (pageNumber) * 10000,
        orderBy: {
            page_id: 'asc'
        },
        where: {
            simple_meanings: {
                some: {
                    index: 0
                }
            }
        },
        select: {
            page_id: true,
            page_title: true,
            simple_meanings: {
                select: {
                    createdAt: true,
                }
            }
        }
    })
  
    const wiki_pages = simple_pages.map((page) => ({
        url: `${root_URL}/completed_pages/${page.page_title.split(" ").join("-").split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;")}?page=${page.page_id}`,
        lastModified: page.simple_meanings[0].createdAt.toISOString(),
    
    }))

    // const wiki_pages = simple_pages.map((page) => {
    //     return {
    //         url: `${root_URL}/completed_pages/${page.page_title}?page=${page.page_id}`,
    //         lastModified: page.simple_meanings[0].createdAt.toISOString(),
    //     }
    // })
    console.log(wiki_pages.length)
    return [...wiki_pages]
}

export async function GET(request: Request) {
        
    try {
        const url = new URL(request.url)
        const currentPage = url.pathname

        const pageNumber = parseInt(currentPage.split('/').pop() || '0');
        
        
    
        const data = await fetchProducts(pageNumber);
        
    
        if (!data.length) {
            throw new Error('No items found for the given page number');
        }
    
        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${data
                .map((item) => {
                    return `
                    <url>
                        <loc>${item.url}</loc>
                        <lastmod>${item.lastModified}</lastmod>
                    </url>`;
                })
                .join('')} 
        </urlset>`;
            
        return new Response(sitemapXML, {
            headers: { 'Content-Type': 'text/xml' },
        });
        } catch (error) {
        console.error(error);
        return new Response('Internal Server Error', { status: 500 });
        }
  }