

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { RelatedPage } from '@/lib/validators/related_page';
import Link from 'next/link';
import React from 'react';

// make 


interface Props {
    // Define the props for your component here
    related_pages: RelatedPage[];
}






const RelatedPagesBox: React.FC<Props> = async (props) => {
    // Define your component logic here 


    
    return (
        // Return your JSX here 
        <div>
            <div className='flex items-center justify-center'>
                <h4 className="mb-4 flex bg-gradient-to-br from-primary to-secondary bg-clip-text w-fit pb-1 text-xl font-bold text-transparent">Related Pages</h4>
            </div>
            <ScrollArea className="h-96 w-full  rounded-md border border-gray-400">
                <div className="p-4">
                    {props.related_pages.map((related_page, index) => {
                        const truncated_description = related_page.page_description.length > 200 ? related_page.page_description.slice(0, 250) + "..." : related_page.page_description;
                        return(
                        <div key={index} className="">
                            <Link href={`/pages/${related_page.page_title}?page=${related_page.page_id}`}>
                                <h5 className='text-lg font-semibold italic text-blue-600' >
                                    {related_page.page_title.split("_").join(" ")}
                                </h5>
                                <p className='mt-6 text-sm '>
                                    {truncated_description}
                                </p>
                            </Link>
                            
                            <Separator className="my-2" />
                        </div>
                        )
                        }
                    )}
                </div>
            </ScrollArea>
        </div>

    );
};

export default RelatedPagesBox;