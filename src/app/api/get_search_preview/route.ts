import { PageSummary } from "@/lib/validators/page_summary";

type searchResults = {
    ns: number
    title: string;
    pageid: number;
}

type improvedSearchResults = {
    title: string;
    pageid: number;
    snippet: string;
}

async function getSearchResults(searchQuery: string | undefined) {
    const wiki = require('wikipedia');
    const searchResults = await wiki.search(searchQuery, {limit: 10});
    return searchResults.results as searchResults[];
}

async function getSummaryLine(page_id: number) {
    if (page_id == null) {
        return null
    }
    const wiki = require('wikipedia');
    const pageResult = await wiki.page(page_id);
    

    
    const summary_data = await pageResult.summary() as PageSummary;
       
        
    
    return summary_data
}

export async function GET(request: Request) {
    const url = new URL(request.url)
    const queryParam = url.searchParams
    
    
    const searchQuery = (queryParam.get('q') || "0")
        
        
    try{
        const searchResults = await getSearchResults(searchQuery)
        const summarizedResults = []

        for (let i = 0; i < searchResults.length; i++) {
            const page_summary = await getSummaryLine(searchResults[i].pageid) as PageSummary;
            const is_valid_type = (page_summary as PageSummary).type === "standard";
            if (is_valid_type) {
                summarizedResults.push({
                    title: searchResults[i].title,
                    pageid: searchResults[i].pageid,
                    snippet: page_summary.extract
                })
            }
        }
        
        


        return new Response(JSON.stringify({searchPreview : summarizedResults}))
    }
    catch{

        return new Response("Error")
    }
  
}


