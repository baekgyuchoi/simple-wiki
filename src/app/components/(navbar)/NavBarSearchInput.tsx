"use client";


import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import PreviewSearchItemButton from "../(search-page)/PreviewSearchItemButton";
import { Loader2 } from "lucide-react";

type improvedSearchResults = {
  title: string;
  pageid: number;
  snippet: string;
}

const NavBarSearchInput = () => {
 
  const [searchQuery, setSearchQuery] = useState<string | null>("");
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string | null>("");
  const [searchPreviewArray, setSearchPreviewArray] = useState<improvedSearchResults[] | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isMouseOnPreview, setIsMouseOnPreview] = useState<boolean>(false);
  const [isSearchSubmitted, setSearchSubmitted] = useState<boolean>(false);
  const submitSearch = (inputString: string | null) => {
      
      if (typeof inputString !== "string") {
          return
      }
      setSearchSubmitted(true);
      router.push(`/search?q=${inputString}`);
  }
  // Debounce function
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // Update search query with a debounce
  const updateSearchQuery = useCallback(
    debounce((value: string) => setSearchQuery(value), 500),
    []
  );

const fetchData =  async () => {
  const response = await fetch(`/api/get_search_preview?q=${searchQuery}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json()
  console.log(data)
  setSearchPreviewArray(data.searchPreview as improvedSearchResults[])

}

useEffect(() => {
    if (typeof searchQuery !== "string") {
        return
    }
    if (searchQuery.length > 0) {
        fetchData();
    }
}, [searchQuery]);


  return (
    <div className="flex flex-col justify-center w-full rounded p-2 transition ">
      <div className="relative w-full">
        <input
          value={inputValue || ""}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {if (!isMouseOnPreview){setIsFocused(false)}}}
          onChange={(event) => {
            setInputValue(event.target.value);
            updateSearchQuery(event.target.value);
          }}
          onKeyDown={(event) => {if (event.key === 'Enter') {submitSearch(inputValue)}}    }
          className="w-full bg-white text-black placeholder-black border-2 border-black bg-opacity-50 px-5 py-2 sm:px-5 sm:py-3 font-mono w-full flex-1  hover:bg-gray-200 hover:bg-opacity-20 focus:bg-gray-200 focus:bg-opacity-20 rounded-full placeholder:text-base"
          placeholder="Search a wiki article"
        />
        {
          isSearchSubmitted? 
          (<>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Loader2 className="w-6 h-6 animate-spin text-black"/>
            </div>
          </>) : (<> </>)
        }
        <div 
          className="bg-transparent z-index-100 z-10" 
          onMouseDown={(e) => e.preventDefault()}
        >
          {searchQuery === null ||searchQuery?.length === 0||!isFocused? (
            <></>
          ):(
            <div className=" absolute mt-1 w-full p-2   max-h-80 overflow-y-auto  "
            >
              
       
              <ul>
                {searchPreviewArray?.map((searchResult,index) => (
                  
                  <li key={index}>
                    <PreviewSearchItemButton page_title={searchResult.title} page_id={searchResult.pageid} snippet={searchResult.snippet} key={index}/>
                    
                  </li>
              
                  
                )
                )}
              </ul>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default NavBarSearchInput;