import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";


import prisma from "@/lib/db";
import { PageInfo } from "@/lib/validators/page_info";
import { RelatedPage } from "@/lib/validators/related_page";
import validator from "validator"
import ReferenceList from "@/app/components/(wiki-page)/ReferenceList";
import RelatedPagesBox from "@/app/components/(wiki-page)/RelatedPagesBox";
import CompletedPageContent from "../../components/(wiki-page)/CompletedPageContent";
import { redirect } from "next/navigation";



export const maxDuration = 50



export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | null};
}): Promise<Metadata> {
  const searchQuery = searchParams?.page
  const page_id = parseInt(searchQuery!)
  // read route params

  const wiki_db = await prisma.pages.findUnique({
    where: {
      page_id: page_id
    }
  })


  if (wiki_db === null) {
    return {
      title: `` ,
      description: "",
     
    }
  }

  try{
    const simple_meanings = await prisma.simpleMeaning.findMany({
      where: {
        articleId: page_id
      }
    })

    if (simple_meanings.length > 0) {

      return {
        metadataBase: new URL("https://www.thesimplewiki.com/completed_pages/" + wiki_db.page_title.split(" ").join("-").split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;") + "?page=" + page_id.toString()),
        title: `About ${wiki_db.page_title} - Simplified | SimpleWiki`,
        description: simple_meanings[0].meaning,
        openGraph: {
          title: `About ${wiki_db.page_title} - Simplified | SimpleWiki`,
          description: simple_meanings[0].meaning,
          images: [
            {
              url: wiki_db.thumbnail_source,
              width: wiki_db.thumbnail_width,
              height: wiki_db.thumbnail_height,
              alt: `Image of ${wiki_db.page_title}`
            }
          ]
          }
        }
      }
    }catch(e){
      console.log("Error: ", e)
      return {
        title: `` ,
        description: "",
      
      }
    }
    return {
      title: `` ,
      description: "",
    
    }
  };






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
        related_pages: true,
        simple_meanings: true
      }
      
    }) 

    return wiki_db as PageInfo
  }
  catch(e){
    console.log(e)
    return null
  }
}




 

export default async function CompletedWikiPage({ params, searchParams }: {
    params: { page_title_slug : string };
    searchParams?: { [key: string]: string | null}; 
    }) {
        // const Client = new Genius.Client("oNwFSu_AIjtrw3owTLM9p_RYc2o9EjyJTNv9Lf05GDgl7adlODR9DQwiUlz8FzDZ");
        // const search = await Client.songs.search(params.song_slug);
        // const lyrics = await search[0].lyrics();
        
        
        const searchQuery = searchParams?.page;
        const page_id = parseInt(searchQuery!)
        console.log("Page ID: ", page_id)

        let page_data = ""
        let page_title = ""
        let page_thumbnail_source = ""
        let page_thumbnail_height = 0
        let page_thumbnail_width = 0
        let page_citations = ""
        let related_pages: RelatedPage[] = []

        const page_db = await PageInDB(page_id);
        if (page_db != null && page_db.simple_meanings && page_db?.simple_meanings?.length > 0) {
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
            redirect(`/pages/${params.page_title_slug}?page=${page_id}`)
            
        }
          
          
        
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
                          {page_db.simple_meanings.map((section, index) => {
                            
                            return (
                              
                              <CompletedPageContent key={index} section_title={section.articleTitle} section_content_html={section.meaningHtml}/>
                        
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