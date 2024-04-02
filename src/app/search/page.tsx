
import { Suspense } from "react";
import { Viewport } from "next";
import SearchItemButton from "../components/(search-page)/SearchItemButton";
import { Loader2 } from "lucide-react";
import FooterContainer from "../components/(footer)/FooterContainer";
import { PageSummary } from "@/lib/validators/page_summary";
// import FooterContainer from "../components/(footer)/FooterContainer";


export const viewport: Viewport = {
  maximumScale: 1,
}

type searchResults = {
    ns: number
    title: string;
    pageid: number;
}

type searchQuery = {
    results: searchResults[];
    search: string;
}

type filteredSearchResults = {
    page_id: number;
    page_title: string;
    page_description: string;
    is_valid_type: boolean;
}



async function getSearchResults(searchQuery: string | undefined) {
    const wiki = require('wikipedia');
    const searchResults = await wiki.search(searchQuery, {limit: 30}) as searchQuery;

    const transformed_search_results = searchResults.results.map(async (result: searchResults) => {
      const page_id = result.pageid;
      const page_title = result.title;
      const page = await wiki.page(page_id);
      const page_summary = await page.summary();

      const page_description = page_summary.description || "No description available";
      const is_valid_type = (page_summary as PageSummary).type === "standard";

      if (is_valid_type) {
        return {
          page_id: page_id,
          page_title: page_title,
          page_description: page_description,
          is_valid_type: is_valid_type
        }
      }
    })
    const filtered_search_results = (await Promise.all(transformed_search_results)).filter(result => result !== undefined) as filteredSearchResults[];


    return filtered_search_results;
}


export default async function SearchPage({
    searchParams,
  }: {
    searchParams?: { [key: string]: string | undefined};
  }) {
    const searchQuery = searchParams?.q;
    if (searchQuery === undefined || searchQuery === "" || searchQuery === null) {
      return (
        <main className="">
          <div className="flex flex-col items-center p-4 mb-4 ">
            <h1 className="text-4xl font-bold text-center">No search query provided</h1>
          </div>
        </main>
      )
    }
 
    const data = await getSearchResults(searchQuery) ;
    return (
        <main>
          <div className="flex flex-col items-center p-4 mb-4">
          
          
      
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin" size={80} />
              </div>
            }>
              <div className="w-full lg:w-2/3 mt-4 grid grid-cols-1 gap-x-8 md:mt-6 md:grid-cols-1 md:gap-y-2 block">
                <ul className="">
                  {data.map((result, index: number) => (
                    <li 
                      key={index}
                      className="py-2 w-full flex flex-col flex-row "
                    >
                      <div className="flex bg-transparent tracking-tight text-l md:text-3xl sm:text-3xl hover:outline-blue focus:outline-none focus:shadow-outline">
                        <SearchItemButton page_id={result.page_id} page_title={result.page_title} page_description={result.page_description} />
                      </div>
                      
                    </li>
                  ))}
                </ul>
              </div>
            </Suspense>
            
            
      
          </div>
      
        </main>
      );

  }




