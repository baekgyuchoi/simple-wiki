import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import PageContent from "@/app/components/(wiki-page)/PageContent";
import { Loader2 } from "lucide-react";
import FooterContainer from "@/app/components/(footer)/FooterContainer";
import prisma from "@/lib/db";
import { PageInfo } from "@/lib/validators/page_info";
import { RelatedPage } from "@/lib/validators/related_page";
import validator from "validator"
import ReferenceList from "@/app/components/(wiki-page)/ReferenceList";
import RelatedPagesBox from "@/app/components/(wiki-page)/RelatedPagesBox";



export const maxDuration = 50



// export async function generateMetadata({
//   searchParams,
// }: {
//   searchParams?: { [key: string]: string | null};
// }): Promise<Metadata> {
//   const searchQuery = searchParams?.page
//   const page_id = parseInt(searchQuery!)
//   // read route params
//   const wiki_db = await prisma.articles.findUnique({
//     where: {
//       page_id: page_id
//     },
//     include: {
//       hood_meaning: true
//     }
//   })

//   let page_description = ""
//   try{
//     page_description = wiki_db?.hood_meaning[0]?.meaning || ""
//   }
//   catch{
//     const page_title = wiki_db?.page_title_string || ""
//     page_description = "Hoodwiki article about: " + page_title 
//   }

 
//   if (wiki_db == null) {
//     return {
//       title: `Meaning of `,
//       description: "Meaning of this song - parsed by AI",
     
//     }
//   }
//   return {
//     title: `About ${wiki_db.page_title_string}`,
//     description: page_description,
//     }
//   };






async function PageInDB(page_id: number) {
  if (page_id == null) {
   
    return null
  }
  try{

    const wiki_db = await prisma.pages.findUnique({
      where: {
        page_id: page_id
      },
      include:{
        related_pages: true
      }
      
    }) 

    return wiki_db as PageInfo
  }
  catch(e){
    console.log(e)
    return null
  }
}

async function PostPageToDB(page_id: number, page_title: string, page_content: string, page_thumbnail_source: string, page_thumbnail_width: number, page_thumbnail_height: number, citations: string, related_pages: RelatedPage[]) {

  const related_pages_filtered = related_pages.map((related) => {
    return {
      page_id: related.page_id,
      page_title: related.page_title,
      page_description: related.page_description
    }
  })
  try{
    await prisma.pages.create({
      data: {
        page_id: page_id,
        page_title: page_title,
        page_content: page_content,
        thumbnail_source: page_thumbnail_source,
        thumbnail_width: page_thumbnail_width,
        thumbnail_height: page_thumbnail_height,
        citations: citations,
        related_pages:{
          create: related_pages_filtered
        }
      }
    })
    
    return true
  }
  catch(e){
    console.log(e)
    return false
  }

}


async function PageInWiki(page_id: number) {
  if (page_id == null) {
    return null
  }
    const wiki = require('wikipedia');
    const pageResult = await wiki.page(page_id);
    
    const content_data = await pageResult.content();
  

    return content_data
}

async function PageSummaryInWiki(page_id: number) {
    if (page_id == null) {
        return null
    }
        const wiki = require('wikipedia');
        const pageResult = await wiki.page(page_id);
     
    
        
        const summary_data = await pageResult.summary();

       
        
    
        return summary_data
    
}

async function CitationsInWiki(page_id: number) {
  if (page_id == null) {
    return null
  }
  const wiki = require('wikipedia');
  
  try{

    const pageResult = await wiki.page(page_id);
  
    
    const citations_data = await pageResult.references({limit:100});

    
    citations_data.filter((citation: string) => {
      return validator.isURL(citation)
    })


    return citations_data.toString() as string


  }
  catch(e){
    console.log(e)
  }
    
   



    return ""
  
}

async function RelatedPagesInWiki(page_id: number) {
  if (page_id == null) {
    return null
  }
    const wiki = require('wikipedia');
    const pageResult = await wiki.page(page_id);
  
    
    const related_data = await pageResult.related();

    const related_pages: RelatedPage[] = related_data.pages.map((related: any) => {
      return {
        mother_page_id: page_id,
        page_id: related.pageid,
        page_title: related.title,
        page_description: related.extract
      }
    })


    return related_pages
}



 

export default async function WikiPage({ params, searchParams }: {
    params: { page_title_slug : string };
    searchParams?: { [key: string]: string | null}; 
    }) {
        // const Client = new Genius.Client("oNwFSu_AIjtrw3owTLM9p_RYc2o9EjyJTNv9Lf05GDgl7adlODR9DQwiUlz8FzDZ");
        // const search = await Client.songs.search(params.song_slug);
        // const lyrics = await search[0].lyrics();
        
        const exclude_list = ["See also", "References", "External links", "Further reading", "Sources", "Notes", "Citations", "Bibliography"]
    
        const searchQuery = searchParams?.page;
        const page_id = parseInt(searchQuery!)

        let page_data = ""
        let page_title = ""
        let page_thumbnail_source = ""
        let page_thumbnail_height = 0
        let page_thumbnail_width = 0
        let page_citations = ""
        let related_pages: RelatedPage[] = []

        const page_db = await PageInDB(page_id);
        if (page_db != null) {
            console.log("Page found in DB")
            page_data = page_db.page_content
            page_title = page_db.page_title
            page_thumbnail_source = page_db.thumbnail_source
            page_thumbnail_height = page_db.thumbnail_height
            page_thumbnail_width = page_db.thumbnail_width
            page_citations = page_db.citations
            related_pages = page_db.related_pages
        }
        else {
          console.log("Page not found in DB")
          const page_summary = await PageSummaryInWiki(page_id);
       
          page_data = await PageInWiki(page_id) as string;
          page_title = page_summary.title
          page_thumbnail_source = page_summary.thumbnail?.source || ""
          page_thumbnail_height = page_summary.thumbnail?.height || 0
          page_thumbnail_width = page_summary.thumbnail?.width || 0

          page_citations = await CitationsInWiki(page_id) as string;
          related_pages = await RelatedPagesInWiki(page_id) as RelatedPage[]

          const posted = await PostPageToDB(page_id, page_title, page_data, page_thumbnail_source, page_thumbnail_width, page_thumbnail_height, page_citations, related_pages)
          console.log(posted)
        }

  
        




        const page_data_organized = page_data.split(/(?=^==[^=].*?==$)/gm).map((section,index) => {
            // Split each section further into subsections or paragraphs
            if (index === 0) {
                return {
                    title: "Introduction",
                    content: section,
                };
            }
            const [sectionTitle, ...content] = section.split("\n").filter(line => line.trim() !== "");
           
            if (!sectionTitle.startsWith("==") || !sectionTitle.endsWith("==")) {

            }
      
          
            return {
              title: sectionTitle.replace(/=+/g, '').trim(), // Remove '=' from titles
              content: content.join("\n"),
            };
            
          });
          
          
        
          return (
              <main className="">
                  <div className='flex flex-col items-center md:px-4 py-8'>

                  

                    <div className='flex w-full flex-1 flex-col items-center pl-0 pr-0 '>
                      <Card className=" text-black  sm:w-3/4 w-full mb-0.5 flex-1 rounded-t-3xl from-primary to-primary/80 shadow-xl border-black border-2 sm:mb-8 sm:flex-initial sm:rounded-b-3xl">
                      <CardHeader className="mt-12 sm:mt-32 mx-6 flex flex-col items-center md:flex-row">
                        <div className="w-full md:w-1/2 flex flex-col items-center justify-center mb-8 md:mb-0 md:mr-8">
                          <h1 className="text-2xl sm:text-3xl font-semibold mb-2">About:</h1>
                          <h1 className="inline-block bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit pb-1 text-3xl font-bold text-transparent sm:text-5xl text-center">
                            {page_title}
                          </h1>
                        </div>
                        <div className="w-full md:w-1/2 rounded-lg flex justify-center   overflow-hidden">
                          <Image
                            src={page_thumbnail_source}
                            alt="image here"
                            width={page_thumbnail_width}
                            height={page_thumbnail_height}
                            className="rounded-lg"
                          />
                        </div>
                      </CardHeader>

                      
                         

                        <CardContent className="p-1 sm:px-20 sm:py-5  flex flex-col items-center mb-5">
                            
                             
                          <div className="">
                          {page_data_organized.map((section, index) => {
                            if (exclude_list.includes(section.title)) {
                              return null
                            }
                            
                              return (
                                <Suspense key={index} fallback={<div className="py-20 flex justify-center"><Loader2 className="animate-spin" /></div>}>
                                  <PageContent page_title={page_title} page_id={page_id} section_title={section.title} section_index={index} section_text={section.content}/>
                                </Suspense>
                              )
                          })}
                          </div>
                          {/* Related pages and citations */}
                          <div className="flex-col w-full ">
                            {
                              related_pages.length > 0 ?
                              (
                                <div className="w-full p-2">
                                  <RelatedPagesBox related_pages={related_pages} />
                                </div>
                              ) : (
                                <></>
                              )
                            }
                            {
                              page_citations.length > 0 ?
                              (
                                <div className="w-full p-2">
                                  <ReferenceList citations={page_citations} />
                                </div>
                              ) : (
                                <></>
                              )
                            }
                            
                            
                          </div>


                    
                        
                        </CardContent>
                      </Card>
           
                    </div>
                  
                
                
              </div>
              

            </main>

          );

        }